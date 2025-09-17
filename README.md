
# GitHub App - R&D Project

A GitHub App that automatically comments on new pull requests.

## Prerequisites

- Node.js (v14 or higher)
- A GitHub App registered on GitHub
- Private key file for your GitHub App

## Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd github-app-R_and_D
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
APP_ID=your_github_app_id                       <!-- In this case arafat-hello-world-gh-app  -->
WEBHOOK_SECRET=your_webhook_secret              <!-- Random string that you can use in registering the app  -->
PRIVATE_KEY_PATH=path/to/your/private-key.pem
```

## Usage

### Start the Server

```bash
npm run server
```

The server will start on `http://localhost:3000` and listen for webhook events at `/api/webhook`.

### Webhook Testing with Smee

For local development, use Smee to forward GitHub webhooks to your local server:

```bash
# Install smee-client globally
npm install --global smee-client

# Forward webhooks to your local server
npx smee -u https://smee.io/upQ9WIqv73cohdE4 -t http://localhost:3000/api/webhook
```

### Testing the Server

You can test the server with curl:

```bash
# Test GET request (should return 404)
curl http://localhost:3000/api/webhook

# Test POST request (should return 400 - missing GitHub headers)
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```


## Webhook Events

Currently handles:
- `pull_request.opened` - Posts a comment with contributing guidelines

## Project Structure

```
├── app.js              # Main application file
├── package.json        # Dependencies and scripts
├── .env               # Environment variables (create this)
└── README.md          # This file
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_ID` | Your GitHub App ID | `123456` |
| `WEBHOOK_SECRET` | Webhook secret for signature validation | `your_secret_here` |
| `PRIVATE_KEY_PATH` | Path to your GitHub App private key | `./private-key.pem` |

## Development

The app uses:
- **Octokit**: GitHub API client
- **dotenv**: Environment variable management
- **Node.js HTTP**: Built-in HTTP server

## Referances

https://docs.github.com/en/apps/creating-github-apps/writing-code-for-a-github-app/building-a-github-app-that-responds-to-webhook-events#get-a-webhook-proxy-url