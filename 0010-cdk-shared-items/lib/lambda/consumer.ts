import { EventBridgeHandler } from 'aws-lambda';
import * as util from 'node:util';

// The whole purpose of this handler is to log the greeting
// sent by the producer Lambda
export const handler: EventBridgeHandler<'MyEvent', string, void> = async (
  event
) => {
  console.log(`Received event: ${util.inspect(event.detail, { depth: null })}`);
};
