# How to Get a Valid Gemini API Key

## Step 1: Go to Google AI Studio
Visit: **https://makersuite.google.com/app/apikey**

## Step 2: Sign In
- Sign in with your Google account
- Make sure you're using the same account that has access to Google Cloud services

## Step 3: Create API Key
1. Click **"Create API Key"** or **"Get API Key"** button
2. Select or create a Google Cloud project (if prompted)
3. Copy the generated API key (it will start with `AIza...`)

## Step 4: Update Your .env File

1. Open the backend `.env` file:
   ```bash
   cd backend
   nano .env
   # or use your preferred editor (VS Code, etc.)
   ```

2. Find the line:
   ```
   GEMINI_API_KEY=AIzaSyB4LEap-zNKHNj5p6qoDmaI7SizqBYVZe8
   ```

3. Replace it with your new API key:
   ```
   GEMINI_API_KEY=your-new-api-key-here
   ```

4. Save the file

## Step 5: Restart Backend Server
The backend will automatically reload, or you can manually restart it.

## Troubleshooting

### If you get "API Key not found" error:
- Make sure there are no extra spaces in the .env file
- Make sure the key starts with `AIza`
- Make sure the key is at least 35 characters long
- Verify the key is active in Google AI Studio

### If you get "API key quota exceeded":
- Check your Google Cloud billing account
- Some API keys have usage limits
- You may need to enable billing in Google Cloud Console

### If the key still doesn't work:
1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Navigate to "APIs & Services" > "Credentials"
3. Check if your API key is enabled
4. Make sure "Generative Language API" is enabled for your project

## Alternative: Use Environment Variable Directly

You can also set the API key as an environment variable:
```bash
export GEMINI_API_KEY=your-api-key-here
```

Then restart the backend server.

