# Google OAuth Setup Guide

This guide explains how to set up Google OAuth credentials to enable Google Sheets and Google Drive integration for form submissions.

## Overview

The application uses OAuth 2.0 to authenticate with Google APIs, allowing it to:
- Save form submissions to Google Sheets
- Upload insurance card images to Google Drive

## Prerequisites

- A Google account
- Access to Google Cloud Console
- Admin access to the Google Sheets and Drive folders you want to use

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "Forward Recovery Forms")
5. Click "Create"

## Step 2: Enable Required APIs

1. In your Google Cloud project, go to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - **Google Sheets API**
   - **Google Drive API**

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in the required fields (App name, user support email, developer email)
   - Click "Save and Continue"
   - Skip adding scopes for now
   - Add your email as a test user
   - Click "Save and Continue"
4. Back on the credentials page:
   - Application type: **Web application**
   - Name: "Forward Recovery Web Client"
   - Authorized redirect URIs: Add `http://localhost`
   - Click "Create"
5. **Save your Client ID and Client Secret** - you'll need these later

Example:
```
Client ID: YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
Client Secret: GOCSPX-YOUR_CLIENT_SECRET_HERE
```

## Step 4: Generate Refresh Token

1. Create an HTML file called `get-refresh-token.html` with the following content:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Get Google Refresh Token</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        input, button { margin: 10px 0; padding: 10px; width: 100%; }
        #result { background: #f0f0f0; padding: 15px; margin: 20px 0; word-break: break-all; }
        .step { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <h1>Get Google Refresh Token</h1>

    <div class="step">
        <h3>Step 1: Enter Your OAuth Credentials</h3>
        <input type="text" id="clientId" placeholder="Client ID">
        <input type="text" id="clientSecret" placeholder="Client Secret">
        <button onclick="getAuthCode()">Get Authorization Code</button>
    </div>

    <div class="step">
        <h3>Step 2: Authorize and Copy the Code</h3>
        <p>After clicking the button above, you'll be redirected to Google. After authorizing, you'll see an error page. <strong>Don't worry!</strong> Copy the authorization code from the URL.</p>
        <p>The URL will look like: <code>http://localhost/?code=YOUR_CODE_HERE</code></p>
        <input type="text" id="authCode" placeholder="Paste authorization code here">
        <button onclick="getRefreshToken()">Get Refresh Token</button>
    </div>

    <div class="step">
        <h3>Step 3: Your Refresh Token</h3>
        <div id="result">Your refresh token will appear here...</div>
        <button onclick="copyToken()">Copy to Clipboard</button>
    </div>

    <script>
        let refreshToken = '';

        function getAuthCode() {
            const clientId = document.getElementById('clientId').value;
            const redirectUri = 'http://localhost';
            const scope = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file';

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
                `client_id=${encodeURIComponent(clientId)}&` +
                `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                `response_type=code&` +
                `scope=${encodeURIComponent(scope)}&` +
                `access_type=offline&` +
                `prompt=consent`;

            window.open(authUrl, '_blank');
        }

        async function getRefreshToken() {
            const clientId = document.getElementById('clientId').value;
            const clientSecret = document.getElementById('clientSecret').value;
            const authCode = document.getElementById('authCode').value;
            const redirectUri = 'http://localhost';

            try {
                const response = await fetch('https://oauth2.googleapis.com/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        code: authCode,
                        client_id: clientId,
                        client_secret: clientSecret,
                        redirect_uri: redirectUri,
                        grant_type: 'authorization_code',
                    }).toString(),
                });

                const data = await response.json();

                if (data.refresh_token) {
                    refreshToken = data.refresh_token;
                    document.getElementById('result').innerText = refreshToken;
                    alert('Success! Your refresh token is ready. Click "Copy to Clipboard" to copy it.');
                } else {
                    document.getElementById('result').innerText = 'Error: ' + JSON.stringify(data, null, 2);
                }
            } catch (error) {
                document.getElementById('result').innerText = 'Error: ' + error.message;
            }
        }

        function copyToken() {
            navigator.clipboard.writeText(refreshToken);
            alert('Refresh token copied to clipboard!');
        }
    </script>
</body>
</html>
```

2. Open the HTML file in your browser
3. Enter your Client ID and Client Secret
4. Click "Get Authorization Code"
5. A new tab will open - sign in with your Google account and grant permissions
6. You'll see an error page (`localhost refused to connect`) - this is expected!
7. Copy the `code` parameter from the URL (everything after `code=` and before `&scope` if present)
8. Paste the code into the "Paste authorization code here" field
9. Click "Get Refresh Token"
10. **Copy and save your refresh token** - you'll need this for your `.env` file

Example refresh token:
```
1//YOUR_REFRESH_TOKEN_WILL_BE_VERY_LONG_STRING_HERE
```

## Step 5: Set Up Google Sheet

1. Create a new Google Sheet or use an existing one
2. Create two sheets (tabs):
   - **leads** - for quiz form submissions (columns A-S)
   - **Contact** - for contact form submissions (columns A-D)
3. Copy the Sheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Example ID: `1Quc47nx3FYJoMYE4tNxKBy8Y9DJbndPdTbIdSWqdeSk`

### Sheet Structure

**leads sheet** (Quiz submissions):
- Column A: Timestamp
- Column B: Full Name
- Column C: Phone
- Column D: Email
- Column E: Date of Birth
- Column F: Seeking Help For
- Column G: Primary Issue
- Column H: Duration
- Column I: Frequency
- Column J: Withdrawal
- Column K: Previous Treatment
- Column L: Environment
- Column M: Mental Health
- Column N: Insurance Type
- Column O: Insurance Provider
- Column P: Insurance Card Image
- Column Q: Recovery Readiness
- Column R: Urgency
- Column S: Consent to Contact

**Contact sheet** (Contact form submissions):
- Column A: Timestamp
- Column B: Name
- Column C: Email
- Column D: Message

## Step 6: Set Up Google Drive Folder

1. Go to [Google Drive](https://drive.google.com/)
2. Create a new folder for insurance card uploads (e.g., "Forward Recovery Insurance Cards")
3. Copy the Folder ID from the URL:
   - URL format: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
   - Example ID: `1VAEeXx-iNY4i4E6aK79s-Rji24P0odpe`

## Step 7: Configure Environment Variables

Create a `.env` file in your project root with the following variables:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REFRESH_TOKEN=your-refresh-token-here

# Google Sheet ID
GOOGLE_SHEET_ID=your-sheet-id-here

# Google Drive Folder ID
GOOGLE_DRIVE_FOLDER_ID=your-folder-id-here
```

## Step 8: Deploy to Vercel

If deploying to Vercel, add the environment variables:

### Using Vercel CLI:

```bash
# Navigate to your project directory
cd onepage-fr

# Add each environment variable
printf "YOUR_CLIENT_ID" | vercel env add GOOGLE_CLIENT_ID production
printf "YOUR_CLIENT_SECRET" | vercel env add GOOGLE_CLIENT_SECRET production
printf "YOUR_REFRESH_TOKEN" | vercel env add GOOGLE_REFRESH_TOKEN production
printf "YOUR_SHEET_ID" | vercel env add GOOGLE_SHEET_ID production
printf "YOUR_FOLDER_ID" | vercel env add GOOGLE_DRIVE_FOLDER_ID production

# Deploy
vercel --prod
```

### Using Vercel Dashboard:

1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add each variable for the Production environment
4. Redeploy your application

## Troubleshooting

### "invalid_client" Error

This means the Client ID or Client Secret is incorrect. Common causes:
- Extra whitespace or newlines in the credentials
- Using credentials from a different Google Cloud project
- The OAuth client was deleted or disabled

**Solution**:
- Remove and re-add the credentials using `printf` (no newlines)
- Verify the credentials in Google Cloud Console

### "Access blocked" Error

This means the OAuth consent screen isn't configured properly.

**Solution**:
- Add your email as a test user in the OAuth consent screen
- Make sure the required scopes are enabled

### Submissions Not Appearing in Sheet

**Solution**:
- Verify the Sheet ID is correct
- Check that the sheet tabs are named exactly "leads" and "Contact"
- Make sure the Google account used for OAuth has edit access to the sheet

### Image Upload Failing

**Solution**:
- Verify the Drive Folder ID is correct
- Make sure the Google account used for OAuth has edit access to the folder
- Check that the Drive API is enabled in Google Cloud Console

## Security Notes

- **Never commit your `.env` file to Git** - add it to `.gitignore`
- Keep your Client Secret and Refresh Token private
- Refresh tokens don't expire unless revoked
- If credentials are compromised, revoke them in Google Cloud Console and generate new ones

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Google Drive API Documentation](https://developers.google.com/drive/api)
