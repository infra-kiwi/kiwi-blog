/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import {
  CloudWatchLogsDecodedData,
  CloudWatchLogsHandler,
  CloudWatchLogsLogEvent
} from 'aws-lambda';
import * as util from 'node:util';
import { inspect, promisify } from 'node:util';
import { gunzip } from 'node:zlib';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

// Expects an SNS topic that accepts a {title,body} payload, like the one configured in
// https://blog.infra.kiwi/aws-cdk-a-slack-notification-pipeline-via-aws-chatbot-0e0c76e7f4c3
const { ERRORS_SNS_TOPIC_ARN, AWS_REGION } = process.env;

const gunzipPromise = promisify(gunzip);

const snsClient = ERRORS_SNS_TOPIC_ARN
  ? new SNSClient({
      region: ERRORS_SNS_TOPIC_ARN.split(':')[3]
    })
  : undefined;

export const handler: CloudWatchLogsHandler = async function (event) {
  console.log(`Received event: ${inspect(event, { depth: null })}`);

  // Decode the CloudWatch payload, which comes gzipped
  const payloadBase64 = Buffer.from(event.awslogs.data, 'base64');
  const payloadString = (await gunzipPromise(payloadBase64)).toString('utf-8');
  const payload = JSON.parse(payloadString) as CloudWatchLogsDecodedData;

  console.log(
    `Received error event: ${util.inspect(payload, { depth: null })}`
  );

  if (snsClient) {
    // Prettify the log group name
    const logGroupName = payload.logGroup.replace(/^\/aws\/lambda\//, '');

    // Build the logs url, so we can directly access the correct
    // CloudWatch page. This url makes use of some double encoding, sorry
    // for the looks, but that's how CloudWatch urls look like!
    const logsUrlPrefix = [
      `https://${AWS_REGION}.console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}`,
      `#logsV2:log-groups/log-group/${cloudWatchUrlEncode(encodeURIComponent(payload.logGroup))}`,
      `/log-events/${cloudWatchUrlEncode(encodeURIComponent(payload.logStream))}`
    ].join('');

    // Prettify the errors
    const errorsString = payload.logEvents
      .map((evt) => prettifyError(evt, logsUrlPrefix))
      .join('\n\n---\n\n');

    const notificationPayload = {
      title: `🚨 Lambda error: ${logGroupName}`,
      body: `*${payload.owner}* - The following errors were detected:\n\n${errorsString}`
    };
    await snsClient.send(
      new PublishCommand({
        TopicArn: ERRORS_SNS_TOPIC_ARN,
        Message: JSON.stringify(notificationPayload)
      })
    );
  }
};

export function prettifyError(
  event: CloudWatchLogsLogEvent,
  logsUrlPrefix: string
): string {
  let details:
    | {
        timestamp: string;
        message: string;
      }
    | undefined;

  // Evaluate if the message content is a JSON object
  if (event.message.startsWith('{')) {
    try {
      // If we receive a JSON error, we can decode it and extract the real
      // error message
      const payload = JSON.parse(event.message);

      const timestamp = payload.timestamp;
      let message = payload.message;

      if (timestamp == null || message == null) {
        throw new Error('Unknown log payload format');
      }

      // Fallback for odd/unknown/uncovered cases
      if (typeof message !== 'string') {
        message = util.inspect(message, { depth: null });
      }

      details = {
        timestamp,
        message
      };
    } catch (err) {
      console.log('Failed to decode JSON event', err);
    }
  }

  // If there was no JSON match, try to extract the relevant data
  // using a regular expression based on the standard CloudWatch
  // TEXT logging format
  if (details?.message == null) {
    // Treat the error line as a standard TEXT line
    const match = /^([T:Z\d.-]+)\t[\w-]+\tERROR\t(.+)$/m.exec(event.message);
    if (match) {
      details = {
        timestamp: match[1],
        message: match[2]
      };
    }
  }

  // If all parsing failed, send the whole log line
  if (details?.message == null) {
    details = {
      timestamp: new Date(event.timestamp).toISOString(),
      message: event.message
    };
  }

  // Make logs start 1s before the actual log message
  // CloudWatch normally does 100ms, but it is restrictive in low
  // traffic scenarios
  const logsStartTime = event.timestamp - 1000;

  // Build the remaining part of the logs url, which will point at the right
  // time slot and highlight the current error message
  const logsUrl =
    logsUrlPrefix +
    cloudWatchUrlEncode(`?start=${logsStartTime}&refEventId=${event.id}`);

  return `
_${details.timestamp}_ (<${logsUrl}|Open CloudWatch logs>)
\`\`\`
${details.message}
\`\`\`  
`.trim();
}

// Little helper to work with CloudWatch url fragments
function cloudWatchUrlEncode(str: string) {
  return encodeURIComponent(str).replaceAll('%', '$');
}
