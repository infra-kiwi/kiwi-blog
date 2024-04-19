import { APIGatewayProxyHandler } from 'aws-lambda';
import { inspect } from 'node:util';

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log(`Got event: ${inspect(event, { depth: null })}`);

  const body = JSON.parse(event.body ?? '{}');
  const { name } = body;
  if (name) {
    return {
      statusCode: 200,
      body: `Hello ${name}!`
    };
  }

  return {
    statusCode: 401,
    body: "I don't know your name!"
  };
};
