import { NextRequest, NextResponse } from 'next/server';

// Environment variables for Google APIs
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN!;
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID!;

async function getAccessToken(): Promise<string> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }).toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Token refresh error:', errorText);
    throw new Error(`Failed to refresh token: ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function uploadImageToDrive(base64Image: string, fileName: string, accessToken: string): Promise<string | null> {
  try {
    const base64Data = base64Image.split(',')[1];
    const binaryData = Buffer.from(base64Data, 'base64');

    const metadata = {
      name: fileName,
      parents: [GOOGLE_DRIVE_FOLDER_ID],
      mimeType: 'image/jpeg',
    };

    const boundary = '===============7330845974216740156==';
    const metadataStr = JSON.stringify(metadata);

    const part1 = Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadataStr}\r\n--${boundary}\r\nContent-Type: image/jpeg\r\n\r\n`);
    const part2 = Buffer.from('\r\n--' + boundary + '--');
    const body = Buffer.concat([part1, binaryData, part2]);

    const uploadResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary="${boundary}"`,
      },
      body: body,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Google Drive upload error:', errorText);
      return null;
    }

    const fileData = await uploadResponse.json();
    const fileId = fileData.id;

    // Make file publicly accessible
    await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone',
      }),
    });

    return `https://drive.google.com/uc?id=${fileId}&export=view`;
  } catch (error) {
    console.error('Error uploading image to Drive:', error);
    return null;
  }
}

async function appendToSheet(accessToken: string, row: string[]): Promise<boolean> {
  const values = [row];

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/leads!A:S:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Google Sheets append error:', errorText);
    return false;
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Get access token
    const accessToken = await getAccessToken();

    // Upload insurance card image if provided
    let insuranceCardLink = 'No image';
    if (data.insuranceCardImage) {
      const timestamp = new Date().getTime();
      const fileName = `insurance-card-${data.fullName || 'unknown'}-${timestamp}.jpg`;
      const link = await uploadImageToDrive(data.insuranceCardImage, fileName, accessToken);
      if (link) {
        insuranceCardLink = link;
      }
    }

    // Prepare row data for Google Sheets - Forward Recovery format
    const row = [
      new Date().toISOString(),                                    // A: Timestamp
      data.fullName || '',                                         // B: Full Name
      data.phone || '',                                            // C: Phone
      data.email || '',                                            // D: Email
      data.dateOfBirth || '',                                      // E: Date of Birth
      data.seekingHelpFor || '',                                   // F: Seeking Help For
      data.primaryIssue || '',                                     // G: Primary Issue
      data.duration || '',                                         // H: Duration
      data.frequency || '',                                        // I: Frequency
      data.withdrawal || '',                                       // J: Withdrawal
      data.previousTreatment || '',                                // K: Previous Treatment
      data.environment || '',                                      // L: Environment
      Array.isArray(data.mentalHealth) ? data.mentalHealth.join(', ') : '', // M: Mental Health
      data.insuranceType || '',                                    // N: Insurance Type
      data.insuranceProvider || '',                                // O: Insurance Provider
      insuranceCardLink,                                           // P: Insurance Card Image
      String(data.recoveryReadiness ?? ''),                        // Q: Recovery Readiness (0-10)
      data.urgency || '',                                          // R: Urgency
      data.consentToContact ? 'Yes' : 'No',                        // S: Consent to Contact
    ];

    // Append to Google Sheets
    const success = await appendToSheet(accessToken, row);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to save to Google Sheets' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Assessment submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Submit quiz error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `Failed to submit: ${errorMessage}` },
      { status: 500 }
    );
  }
}
