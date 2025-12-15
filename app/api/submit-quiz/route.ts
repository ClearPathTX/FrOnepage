import { NextRequest, NextResponse } from 'next/server';
import { google, Auth } from 'googleapis';

async function getAuthClient(): Promise<Auth.OAuth2Client> {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return oauth2Client;
}

async function uploadImageToDrive(
  auth: Auth.OAuth2Client,
  base64Image: string,
  fileName: string
): Promise<string | null> {
  try {
    const drive = google.drive({ version: 'v3', auth });

    // Extract the base64 data and mime type
    const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return null;

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Upload file to Drive
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: mimeType,
      },
      media: {
        mimeType: mimeType,
        body: require('stream').Readable.from(buffer),
      },
      fields: 'id, webViewLink',
    });

    // Make the file publicly viewable
    if (response.data.id) {
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      return `https://drive.google.com/file/d/${response.data.id}/view`;
    }

    return null;
  } catch (error) {
    console.error('Error uploading to Drive:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Format the timestamp
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
    });

    // Upload insurance card image if provided
    let insuranceCardUrl = '';
    if (data.insuranceCardImage) {
      const fileName = `insurance_card_${data.fullName?.replace(/\s+/g, '_') || 'unknown'}_${Date.now()}.jpg`;
      const uploadedUrl = await uploadImageToDrive(auth, data.insuranceCardImage, fileName);
      insuranceCardUrl = uploadedUrl || 'Upload failed';
    }

    const row = [
      timestamp,
      data.fullName || '',
      data.phone || '',
      data.email || '',
      data.seekingHelpFor || '',
      data.primaryIssue || '',
      data.duration || '',
      data.frequency || '',
      data.withdrawal || '',
      data.previousTreatment || '',
      data.environment || '',
      Array.isArray(data.mentalHealth) ? data.mentalHealth.join(', ') : '',
      data.insuranceType || '',
      data.insuranceProvider || '',
      insuranceCardUrl || 'No image',
      data.recoveryReadiness?.toString() || '',
      data.dateOfBirth || '',
      data.urgency || '',
      data.consentToContact ? 'Yes' : 'No',
    ];

    // Append to the spreadsheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'leads!A:S',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    return NextResponse.json({ success: true, message: 'Assessment submitted successfully' });
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message: 'Failed to submit assessment', error: errorMessage },
      { status: 500 }
    );
  }
}
