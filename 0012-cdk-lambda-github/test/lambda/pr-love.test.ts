/*
 * Copyright (c) 2024. Alberto Marchetti [ https://www.linkedin.com/in/albertomarchetti/ ]
 */

import { mockClient } from "aws-sdk-client-mock";
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import {
  secretNameGitHubAppId,
  secretNameGitHubAppInstallationId,
  secretNameGitHubPrivateKey,
} from "../../lib/lambda/common-secret";
import type { EmitterWebhookEvent } from "@octokit/webhooks";

const smClientMock = mockClient(SecretsManagerClient);
jest.mock("@octokit/webhooks", () => ({
  Webhooks: class {
    private callback: (event: EmitterWebhookEvent) => Promise<void>;

    on(
      eventName: string,
      callback: (event: EmitterWebhookEvent) => Promise<void>,
    ) {
      if (eventName != "pull_request.opened")
        throw new Error(`Unsupported event ${eventName}`);
      this.callback = callback;
    }

    async verifyAndReceive(event: {
      id: string;
      name: string;
      payload: string;
    }) {
      const payload = JSON.parse(event.payload);
      await this.callback({
        id: event.id,
        name: event.name as never,
        payload,
      });
    }
  },
}));
const mockCreateForIssueFn = jest.fn();
jest.mock("../../lib/lambda/github-app", () => ({
  getGitHubAppClient: () => ({
    rest: {
      reactions: {
        createForIssue: mockCreateForIssueFn,
      },
    },
  }),
}));

describe("pr-love.ts Lambda", () => {
  const fakeGitHubTokenSecretName = "github-token-fake-secret-name";

  // Prepare the environment for the Lambda function
  beforeEach(() => {
    // Fake GitHub token secret name
    process.env.GITHUB_WEBHOOK_TOKEN_SECRET_NAME = fakeGitHubTokenSecretName;
    process.env.AWS_REGION = "us-east-1";

    smClientMock.reset();
    mockCreateForIssueFn.mockReset();
  });

  test("it triggers a reaction when a new PR is opened", async () => {
    const body = require("../assets/pr_opened.json");

    // Prepare the Secrets Manager mock
    const fakeAppId = "123456";
    const fakeInstallationId = "12345678";
    const fakePrivateKey = "fakeprivatekey";
    const fakeGitHubTokenSecret = "faketoken";
    smClientMock
      .on(GetSecretValueCommand, { SecretId: secretNameGitHubAppId })
      .resolvesOnce({
        SecretString: fakeAppId,
      });
    smClientMock
      .on(GetSecretValueCommand, {
        SecretId: secretNameGitHubAppInstallationId,
      })
      .resolvesOnce({
        SecretString: fakeInstallationId,
      });
    smClientMock
      .on(GetSecretValueCommand, { SecretId: secretNameGitHubPrivateKey })
      .resolvesOnce({
        SecretString: fakePrivateKey,
      });
    smClientMock
      .on(GetSecretValueCommand, { SecretId: fakeGitHubTokenSecretName })
      .resolvesOnce({
        SecretString: fakeGitHubTokenSecret,
      });

    // Prepare the Octokit mock
    let reactionSent = false;
    mockCreateForIssueFn.mockImplementationOnce(() => {
      reactionSent = true;
    });

    await require("../../lib/lambda/pr-love").handler({
      headers: {
        "X-GitHub-Delivery": "123123",
        "X-GitHub-Event": "pull_request",
        "X-Hub-Signature-256": "abcd",
      },
      body: JSON.stringify(body),
    });

    expect(reactionSent).toBeTruthy();
  });
});
