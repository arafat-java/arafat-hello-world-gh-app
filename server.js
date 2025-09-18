import http from "http";
import {createNodeMiddleware} from "@octokit/webhooks";
import {port, host, path, localWebhookUrl} from "./config.js";

// Add logging middleware to track all incoming requests
export const loggingMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Server invoked!`);
  
  // Log the payload for POST requests
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      console.log('POST Request Payload:');
      try {
        // Try to parse and pretty-print JSON
        const jsonPayload = JSON.parse(body);
        console.log(JSON.stringify(jsonPayload, null, 2));
      } catch (error) {
        // If not valid JSON, print as plain text
        console.log(body);
      }
      console.log('POST Request Headers:');
      console.log(JSON.stringify(req.headers, null, 2));
    });
  }
  
  next();
};

// This creates a Node.js server that listens for incoming HTTP requests (including webhook payloads from GitHub) on the specified port.
export function createServer(app) {
  // This sets up a middleware function to handle incoming webhook events.
  //
  // Octokit's `createNodeMiddleware` function takes care of generating this middleware function for you. The resulting middleware function will:
  //
  //    - Check the signature of the incoming webhook event to make sure that it matches your webhook secret. This verifies that the incoming webhook event is a valid GitHub event.
  //    - Parse the webhook event payload and identify the type of event.
  //    - Trigger the corresponding webhook event handler.
  const middleware = createNodeMiddleware(app.webhooks, {path});

  const server = http.createServer((req, res) => {
    // Apply logging middleware first
    loggingMiddleware(req, res, () => {
      // Then apply the webhook middleware
      middleware(req, res);
    });
  });

  return server;
}

// Start the server
export function startServer(server) {
  server.listen(port, () => {
    console.log(`Server is listening for events at: ${localWebhookUrl}`);
    console.log('Press Ctrl + C to quit.');
  });
}
