/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import { getSecretString } from "./secrets";
import {
  secretNameGitHubAppId,
  secretNameGitHubAppInstallationId,
  secretNameGitHubPrivateKey,
} from "./common-secret";

export async function getGitHubAppClient(): Promise<Octokit> {
  const appId = await getSecretString(secretNameGitHubAppId);
  const installationId = await getSecretString(
    secretNameGitHubAppInstallationId,
  );
  const privateKey = await getSecretString(secretNameGitHubPrivateKey);

  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      installationId,
      privateKey,
    },
  });
}
