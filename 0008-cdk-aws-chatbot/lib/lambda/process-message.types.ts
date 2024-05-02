// Our custom payload format
export interface SlackMessagePayload {
  // The title of the Slack message, optional
  title?: string;

  // The body of the Slack message
  body: string;
}

// The payload that SNS sends to Lambdas
// https://docs.aws.amazon.com/lambda/latest/dg/with-sns.html
export interface SNSEvent {
  Records: {
    EventSource: string;
    EventVersion: string;
    EventSubscriptionArn: string;
    Sns: {
      Type: string;
      TopicArn: string;
      Subject?: string;
      Message: string;
      Timestamp: string;
    };
  }[];
}

// The ChatBot message payload.
// You can find more info about the payload format at
// https://docs.aws.amazon.com/chatbot/latest/adminguide/custom-notifs.html
export interface ChatBotPayload {
  version: '1.0';
  source: 'custom';
  content: {
    title?: string;
    description: string;
  };
}
