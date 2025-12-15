import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Use Google Apps Script webhook URL
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      throw new Error('GOOGLE_APPS_SCRIPT_URL not configured');
    }

    // Forward the data to Google Apps Script
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      redirect: 'follow',
    });

    const responseText = await response.text();

    // Try to parse as JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response:', responseText.substring(0, 200));
      throw new Error('Invalid response from Google Apps Script');
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Assessment submitted successfully'
      });
    } else {
      throw new Error(result.error || 'Failed to submit');
    }

  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message: 'Failed to submit assessment', error: errorMessage },
      { status: 500 }
    );
  }
}
