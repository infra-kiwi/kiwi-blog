/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import { Handler } from 'aws-lambda';
import { createSignedFetcher } from 'aws-sigv4-fetch';
import { inspect } from 'node:util';

const { SERVER_GATEWAY_REGION, SERVER_GATEWAY_URL } = process.env;

if (SERVER_GATEWAY_REGION == null) {
  throw new Error('SERVER_GATEWAY_REGION is required');
}
if (SERVER_GATEWAY_URL == null) {
  throw new Error('SERVER_GATEWAY_URL is required');
}

// Create the signer resource, which will take care of authenticating
// our requests to the Server API Gateway
const signedFetcher = createSignedFetcher({
  service: 'execute-api',
  region: SERVER_GATEWAY_REGION
});

export const handler: Handler = async (event) => {
  console.log(`Got event: ${event.body}`);

  // Tell the Server Lambda our name!
  const requestBody = {
    name: 'Mario'
  };

  // Strip any possible trailing slash
  const gatewayUrl = SERVER_GATEWAY_URL.replace(/\/$/, '');

  // Perform the request to the Server API Gateway
  const response = await signedFetcher(`${gatewayUrl}/my-lambda`, {
    body: JSON.stringify(requestBody),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST'
  });

  const responseBody = await response.text();
  console.log(`Response: ${inspect(responseBody, { depth: null })}`);

  if (response.status != 200) {
    throw new Error(`Bad response code: ${response.status}`);
  }

  // This will let us know what we sent and what came back
  return {
    request: requestBody,
    response: responseBody
  };
};
