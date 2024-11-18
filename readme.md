# Google Meet Audio Recorder Extension

This Chrome Extension automatically records audio from Google Meet meetings and uploads it to Fireflies.ai for transcription and archiving. Below are details on how the extension works, its setup, and usage.

## Features
- **Automatic Meeting Detection**: Starts recording when a Google Meet session is detected.
- **Audio Recording**: Captures user’s microphone audio.
- **Meet Metadata**: Saves meeting ID and user email for audio file metadata.
- **Integration with Fireflies.ai**: Uploads audio recordings directly to Fireflies.ai using their GraphQL API.
- **User-Friendly Popup**: Requests user email if not already stored.

## Files Overview

### `content.js`
This script runs in the context of Google Meet pages and handles:
- Detecting when a meeting starts or ends.
- Starting and stopping audio recording using the MediaRecorder API.
- Uploading recorded audio to Fireflies.ai.

### `background.js`
This script operates in the background and:
- Monitors tab updates to detect Google Meet sessions.
- Injects `content.js` into the active Meet tab.
- Opens a popup to collect the user’s email if not saved.

## Setup Instructions

### Prerequisites
1. **Chrome Browser**: Ensure you have Google Chrome installed.
2. **Fireflies.ai Account**: Obtain an API key from your Fireflies.ai account.

### Installation
1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top-right corner.
4. Click on "Load unpacked" and select the folder containing the extension files.

### Configuration
1. Replace the placeholder API key in `content.js` with your actual Fireflies.ai API key:
   ```javascript
   const API_KEY = 'YOUR_API_KEY_HERE';
   ```
2. Save changes to the file.

## Usage
1. Open Google Meet in Chrome.
2. Join a meeting. The extension will automatically start recording when the meeting begins.
3. When the meeting ends, the recording will automatically stop and be uploaded to Fireflies.ai.
4. Check your Fireflies.ai account for the uploaded audio and transcription.

## Notes
- **Audio Blob Conversion**: The current implementation lacks proper conversion from `audioBlob` to `audioUrl`. You must complete this step before uploading to Fireflies.ai.
- **Email Requirement**: The extension requires a user email for tagging recordings. If not provided, a popup will prompt for it.
- **Meet ID Parsing**: The extension attempts to extract the meeting ID from the URL for organizational purposes.

## Limitations
- The extension only records the user’s microphone audio.
- Ensure you have microphone permissions enabled for the extension.

## Contributing
Feel free to submit pull requests to improve functionality, such as:
- Implementing `audioBlob` to `audioUrl` conversion.
- Enhancing error handling and user notifications.

## License
This project is open-source and available under the MIT License.

