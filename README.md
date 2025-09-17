# GitHub Hello World App

A simple GitHub App that automatically adds a "Hello World" comment to every commit in repositories where it's installed.

## Features

- 🚀 Automatically comments on every commit
- 🔒 Secure webhook handling with signature verification
- 📝 Simple and clean "Hello World" messages
- ⚡ Lightweight and fast

## Prerequisites

- Node.js (v14 or higher)
- A GitHub account
- A server or local development environment with a public URL (for webhooks)

## Setup Instructions

### 1. Create a GitHub App

1. Go to [GitHub Developer Settings](https://github.com/settings/apps)
2. Click "New GitHub App"
3. Fill in the following details:
   - **GitHub App name**: `Hello World App` (or any name you prefer)
   - **Homepage URL**: Your app's homepage (can be a placeholder)
   - **Webhook URL**: `https://your-domain.com/webhook` (or use ngrok for local development)
   - **Webhook secret**: Generate a random string and save it
   - **Permissions**:
     - Repository permissions:
       - Contents: Read
       - Metadata: Read
       - Pull requests: Write (for commit comments)
   - **Subscribe to events**: Check "Push"
   - **Where can this GitHub App be installed?**: Any account

4. After creating the app, note down:
   - **App ID** (found in the app settings)
   - **Client ID** (for reference)
   - **Client Secret** (for reference)

### 2. Generate Private Key

1. In your GitHub App settings, scroll down to "Private keys"
2. Click "Generate a private key"
3. Download the `.pem` file
4. Copy the entire content of the `.pem` file (including the `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` lines)

### 3. Install Dependencies

```bash
npm install
```

### 4. Environment Configuration

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and fill in your values:
   ```env
   GITHUB_APP_ID=123456
   GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nYour private key content here\n-----END RSA PRIVATE KEY-----"
   GITHUB_WEBHOOK_SECRET=your_webhook_secret_here
   PORT=3000
   ```

### 5. Local Development Setup

For local development, you'll need to expose your local server to the internet. Use ngrok:

1. Install ngrok: https://ngrok.com/download
2. Start your app:
   ```bash
   npm start
   ```
3. In another terminal, expose your local server:
   ```bash
   ngrok http 3000
   ```
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. Update your GitHub App's webhook URL to: `https://abc123.ngrok.io/webhook`

### 6. Install the App

1. Go to your GitHub App settings
2. Click "Install App"
3. Choose the repositories where you want to install the app
4. Click "Install"

## Usage

Once installed, the app will automatically:

1. Listen for push events from the installed repositories
2. Add a "Hello World" comment to every commit
3. Log activity to the console

## Testing

1. Make a commit to any repository where the app is installed
2. Check the commit page - you should see a "Hello World" comment
3. Check your server logs for confirmation

## Project Structure

```
├── app.js              # Main application file
├── package.json        # Dependencies and scripts
├── env.example         # Environment variables template
└── README.md          # This file
```

## API Endpoints

- `GET /` - Health check endpoint
- `POST /webhook` - GitHub webhook endpoint

## Troubleshooting

### Common Issues

1. **Webhook not receiving events**:
   - Check that your webhook URL is publicly accessible
   - Verify the webhook secret matches your `.env` file
   - Check GitHub App permissions

2. **Permission denied errors**:
   - Ensure the app has the correct permissions
   - Verify the private key is correctly formatted in `.env`

3. **App not commenting**:
   - Check server logs for errors
   - Verify the app is installed on the repository
   - Ensure the app has write permissions for commit comments

### Logs

The app logs all webhook events and errors to the console. Check your server logs for debugging information.

## Security Notes

- Keep your private key secure and never commit it to version control
- Use environment variables for all sensitive configuration
- The webhook secret helps verify that requests come from GitHub

## License

MIT
