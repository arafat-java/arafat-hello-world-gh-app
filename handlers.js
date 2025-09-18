// This defines the message that your app will post to pull requests.
const messageForNewPRs = "Thanks for opening a new PR! Please follow our contributing guidelines to make your PR easier to review.";

// This adds an event handler that your code will call later. When this event handler is called, it will log the event to the console. Then, it will use GitHub's REST API to add a comment to the pull request that triggered the event.
export async function handlePullRequestOpened({octokit, payload}) {
  console.log(`Received a pull request event for #${payload.pull_request.number}`);
  console.log(`Repository: ${payload.repository.owner.login}/${payload.repository.name}`);
  console.log(`PR Title: ${payload.pull_request.title}`);

  try {
    // Get the PR diff
    console.log(`\n=== Fetching PR Diff ===`);
    const diffResponse = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}", {
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      pull_number: payload.pull_request.number,
      headers: {
        "Accept": "application/vnd.github.v3.diff",
        "x-github-api-version": "2022-11-28",
      },
    });
    
    console.log(`\n=== PR DIFF ===`);
    console.log(diffResponse.data);
    console.log(`=== END PR DIFF ===\n`);

    // Also get the files changed for additional context
    const filesResponse = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}/files", {
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      pull_number: payload.pull_request.number,
      headers: {
        "x-github-api-version": "2022-11-28",
      },
    });

    console.log(`\n=== Files Changed ===`);
    filesResponse.data.forEach((file, index) => {
      console.log(`${index + 1}. ${file.filename}`);
      console.log(`   Status: ${file.status}`);
      console.log(`   Additions: +${file.additions}`);
      console.log(`   Deletions: -${file.deletions}`);
      console.log(`   Changes: ${file.changes}`);
      if (file.patch) {
        console.log(`   Patch preview: ${file.patch.substring(0, 200)}${file.patch.length > 200 ? '...' : ''}`);
      }
      console.log('');
    });
    console.log(`=== END Files Changed ===\n`);

    // Add comment to the PR
    await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.pull_request.number,
      body: messageForNewPRs,
      headers: {
        "x-github-api-version": "2022-11-28",
      },
    });
    console.log(`Successfully added comment to PR #${payload.pull_request.number}`);
  } catch (error) {
    if (error.response) {
      console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`)
    }
    console.error(error)
  }
}

// Handler for when PR is synchronized (new commits pushed)
export async function handlePullRequestSynchronized({octokit, payload}) {
  console.log(`Received a pull request synchronized event for #${payload.pull_request.number}`);
  console.log(`Repository: ${payload.repository.owner.login}/${payload.repository.name}`);
  console.log(`PR Title: ${payload.pull_request.title}`);

  try {
    // Get the PR diff
    console.log(`\n=== Fetching PR Diff (Synchronized) ===`);
    const diffResponse = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}", {
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      pull_number: payload.pull_request.number,
      headers: {
        "Accept": "application/vnd.github.v3.diff",
        "x-github-api-version": "2022-11-28",
      },
    });
    
    console.log(`\n=== PR DIFF (Synchronized) ===`);
    console.log(diffResponse.data);
    console.log(`=== END PR DIFF (Synchronized) ===\n`);

    // Also get the files changed for additional context
    const filesResponse = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}/files", {
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      pull_number: payload.pull_request.number,
      headers: {
        "x-github-api-version": "2022-11-28",
      },
    });

    console.log(`\n=== Files Changed (Synchronized) ===`);
    filesResponse.data.forEach((file, index) => {
      console.log(`${index + 1}. ${file.filename}`);
      console.log(`   Status: ${file.status}`);
      console.log(`   Additions: +${file.additions}`);
      console.log(`   Deletions: -${file.deletions}`);
      console.log(`   Changes: ${file.changes}`);
      if (file.patch) {
        console.log(`   Patch preview: ${file.patch.substring(0, 200)}${file.patch.length > 200 ? '...' : ''}`);
      }
      console.log('');
    });
    console.log(`=== END Files Changed (Synchronized) ===\n`);

    console.log(`Successfully processed synchronized PR #${payload.pull_request.number}`);
  } catch (error) {
    if (error.response) {
      console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`)
    }
    console.error(error)
  }
}

// This logs any errors that occur.
export function handleWebhookError(error) {
  if (error.name === "AggregateError") {
    console.error(`Error processing request: ${error.event}`);
  } else {
    console.error(error);
  }
}

// General webhook event logger for debugging
export function logWebhookEvent(eventName, payload) {
  console.log(`=== Webhook Event Received ===`);
  console.log(`Event: ${eventName}`);
  console.log(`Action: ${payload.action || 'N/A'}`);
  console.log(`Repository: ${payload.repository?.full_name || 'N/A'}`);
  console.log(`===============================`);
}
