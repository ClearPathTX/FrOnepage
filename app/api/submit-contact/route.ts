import { NextRequest, NextResponse } from 'next/server';

// Environment variables for Google APIs
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN!;
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID!;

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

async function appendToSheet(accessToken: string, row: string[]): Promise<boolean> {
  const values = [row];

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Contact!A:D:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
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

    // Prepare row data for Contact sheet
    const row = [
      new Date().toISOString(),  // A: Timestamp
      data.name || '',           // B: Name
      data.email || '',          // C: Email
      data.message || '',        // D: Message
    ];

    // Append to Google Sheets
    const success = await appendToSheet(accessToken, row);

    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting contact form:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message: 'Failed to send message', error: errorMessage },
      { status: 500 }
    );
  }
}
