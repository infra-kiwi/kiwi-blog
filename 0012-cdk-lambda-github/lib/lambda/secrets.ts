/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

const smClient = new SecretsManagerClient();

export async function getSecretString(key: string): Promise<string> {
  return (await smClient.send(new GetSecretValueCommand({ SecretId: key })))
    .SecretString!;
}
