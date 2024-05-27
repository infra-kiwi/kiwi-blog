/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import { APIGatewayProxyHandler } from "aws-lambda";
import { EmitterWebhookEvent, Webhooks } from "@octokit/webhooks";
import { EventPayloadMap } from "@octokit/webhooks/dist-types/generated/webhook-identifiers";
import { getGitHubAppClient } from "./github-app";
import { getSecretString } from "./secrets";
import { inspect } from "node:util";

const { GITHUB_WEBHOOK_TOKEN_SECRET_NAME } = process.env;
if (GITHUB_WEBHOOK_TOKEN_SECRET_NAME == null)
  throw new Error(
    "The GITHUB_WEBHOOK_TOKEN_SECRET_NAME environment variable is required",
  );

// The purpose of this webhook handler is to listen for new pull request
// events and answer with a love reaction
export const handler: APIGatewayProxyHandler = async (event) => {
  const webhooks = new Webhooks({
    secret: await getSecretString(GITHUB_WEBHOOK_TOKEN_SECRET_NAME),
  });

  // Set up the webhook handler
  webhooks.on("pull_request.opened", onGitHubPullRequestOpenedWebhook);

  // Process the event payload
  await webhooks.verifyAndReceive({
    id: event.headers["X-GitHub-Delivery"] as string,
    name: event.headers["X-GitHub-Event"] as keyof EventPayloadMap,
    signature: event.headers["X-Hub-Signature-256"] as string,
    payload: event.body!,
  });

  return {
    statusCode: 200,
    body: "Ok",
  };
};

async function onGitHubPullRequestOpenedWebhook(
  event: EmitterWebhookEvent<"pull_request.opened">,
) {
  console.log(
    `Received GitHub pull_request.opened event: ${inspect(event, { depth: null })}`,
  );

  // Whenever we detect a new PR, we then want to answer with a love reaction
  const octokit = await getGitHubAppClient();

  await octokit.rest.reactions.createForIssue({
    owner: event.payload.repository.owner.login,
    repo: event.payload.repository.name,
    issue_number: event.payload.pull_request.number,
    content: "heart",
  });
}
