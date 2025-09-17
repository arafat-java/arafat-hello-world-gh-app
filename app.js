const express = require('express');
const { App } = require('@octokit/app');
const { Octokit } = require('@octokit/rest');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize GitHub App
const githubApp = new App({
  appId: process.env.GITHUB_APP_ID,
  privateKey: process.env.GITHUB_PRIVATE_KEY,
  webhooks: {
    secret: process.env.GITHUB_WEBHOOK_SECRET
  }
});

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'GitHub Hello World App is running!',
    status: 'healthy'
  });
});

// Webhook endpoint for GitHub events
app.post('/webhook', async (req, res) => {
  try {
    const event = req.headers['x-github-event'];
    const payload = req.body;

    console.log(`Received ${event} event`);

    // Handle push events (commits)
    if (event === 'push') {
      await handlePushEvent(payload);
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function handlePushEvent(payload) {
  try {
    const { repository, commits, ref } = payload;
    
    // Skip if no commits
    if (!commits || commits.length === 0) {
      console.log('No commits in push event');
      return;
    }

    // Get installation token
    const installationId = payload.installation.id;
    const octokit = await githubApp.getInstallationOctokit(installationId);

    // Get the latest commit
    const latestCommit = commits[commits.length - 1];
    const commitSha = latestCommit.id;

    // Create a comment on the commit
    await octokit.rest.repos.createCommitComment({
      owner: repository.owner.login,
      repo: repository.name,
      commit_sha: commitSha,
      body: 'Hello World! 👋\n\nThis comment was automatically added by the GitHub Hello World App on every commit.'
    });

    console.log(`Added Hello World comment to commit ${commitSha} in ${repository.full_name}`);
  } catch (error) {
    console.error('Error handling push event:', error);
  }
}

// Start server
app.listen(port, () => {
  console.log(`GitHub Hello World App listening on port ${port}`);
  console.log(`Webhook endpoint: http://localhost:${port}/webhook`);
});

module.exports = app;
