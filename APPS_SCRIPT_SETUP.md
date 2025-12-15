# Google Apps Script Setup for Quiz Submissions

Since service account keys are disabled in your organization, we'll use Google Apps Script as a webhook.

## Steps:

### 1. Open Your Google Sheet
Go to: https://docs.google.com/spreadsheets/d/1Quc47nx3FYJoMYE4tNxKBy8Y9DJbndPdTbIdSWqdeSk/edit

### 2. Open Apps Script Editor
- Click **Extensions** > **Apps Script**

### 3. Replace the Code
Delete everything in `Code.gs` and paste this:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('leads');
    const data = JSON.parse(e.postData.contents);

    // Format timestamp
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles'
    });

    // Handle image upload to Drive if provided
    let imageUrl = 'No image';
    if (data.insuranceCardImage) {
      try {
        const folder = DriveApp.getFolderById('YOUR_FOLDER_ID'); // Replace with folder ID
        const base64Data = data.insuranceCardImage.split(',')[1];
        const blob = Utilities.newBlob(
          Utilities.base64Decode(base64Data),
          data.insuranceCardImage.match(/data:(.+);base64/)[1],
          `insurance_${data.fullName}_${Date.now()}.jpg`
        );
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        imageUrl = file.getUrl();
      } catch (err) {
        imageUrl = 'Upload failed: ' + err.toString();
      }
    }

    // Append row
    sheet.appendRow([
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
      imageUrl,
      data.recoveryReadiness?.toString() || '',
      data.dateOfBirth || '',
      data.urgency || '',
      data.consentToContact ? 'Yes' : 'No'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 4. Create Drive Folder for Images (Optional)
- Go to Google Drive
- Create a folder called "Forward Recovery Insurance Cards"
- Right-click the folder > Share > Get link > Copy
- The folder ID is in the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
- Replace `YOUR_FOLDER_ID` in the script above with your folder ID

Or skip this and images won't be uploaded (the script will still work).

### 5. Deploy the Script
1. Click **Deploy** > **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Settings:
   - Description: "Quiz Webhook"
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** > **Go to [project name] (unsafe)**
9. Click **Allow**
10. **Copy the Web app URL** - it looks like:
    `https://script.google.com/macros/s/XXXXX/exec`

### 6. Update Environment Variables
Add this URL to your `.env.local`:
```
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXXX/exec
```

That's it! The quiz will now submit directly to your Google Sheet via Apps Script.
