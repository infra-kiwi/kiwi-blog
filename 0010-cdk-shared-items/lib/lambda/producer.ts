/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import {
  EventBridgeClient,
  PutEventsCommand
} from '@aws-sdk/client-eventbridge';
import * as util from 'node:util';

const { EVENT_BUS_NAME } = process.env;
if (EVENT_BUS_NAME == null) {
  throw new Error('Missing EVENT_BUS_NAME env var');
}

const eventBridgeClient = new EventBridgeClient();

// The whole purpose of this handler is to send the whole event payload
// over to the EventBus
export const handler = async (event: { greeting: string }) => {
  if (event.greeting == null) {
    throw new Error('Missing greeting!');
  }

  // Generates an event in the EventBus
  const result = await eventBridgeClient.send(
    new PutEventsCommand({
      Entries: [
        {
          Detail: JSON.stringify(event),
          DetailType: 'MyEvent',
          Source: 'ProducerLambda',
          EventBusName: EVENT_BUS_NAME
        }
      ]
    })
  );

  if ((result.FailedEntryCount ?? 0) > 0) {
    throw new Error(
      `Failed to send event: ${util.inspect(result, { depth: null })}`
    );
  }

  return { message: 'Event sent!', result };
};
