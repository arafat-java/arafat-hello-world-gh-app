import {App} from "octokit";
import {appId, privateKey, webhookSecret} from "./config.js";
import {handlePullRequestOpened, handlePullRequestSynchronized, handleWebhookError, logWebhookEvent} from "./handlers.js";
import {createServer, startServer} from "./server.js";

// This creates a new instance of the Octokit App class.
const app = new App({
  appId: appId,
  privateKey: privateKey,
  webhooks: {
    secret: webhookSecret
  },
});

// Add a general webhook event listener for debugging
app.webhooks.onAny(({id, name, payload}) => {
  logWebhookEvent(name, payload);
});

// This sets up a webhook event listener. When your app receives a webhook event from GitHub with a `X-GitHub-Event` header value of `pull_request` and an `action` payload value of `opened`, it calls the `handlePullRequestOpened` event handler that is defined above.
app.webhooks.on("pull_request.opened", handlePullRequestOpened);

// This sets up a webhook event listener for when PR is synchronized (new commits pushed)
app.webhooks.on("pull_request.synchronize", handlePullRequestSynchronized);

// This logs any errors that occur.
app.webhooks.onError(handleWebhookError);

// Create and start the server
const server = createServer(app);
startServer(server);
