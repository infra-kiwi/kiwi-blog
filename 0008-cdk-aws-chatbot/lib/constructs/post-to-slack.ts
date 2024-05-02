import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'node:path';
import {
  Arn,
  aws_iam,
  aws_lambda,
  aws_sns,
  aws_sns_subscriptions,
  CfnOutput,
  Stack
} from 'aws-cdk-lib';
import { Effect } from 'aws-cdk-lib/aws-iam';

export interface SlackLambdaProps {
  /**
   The ChatBot "raw" SNS topic ARN generated
   via the lib/constructs/chatbot-slack-channel.ts construct
   */
  chatbotSNSTopicArn: string;

  /**
   A friendly name for this channel configuration,
   which will be prefixed by `chatbot-` and become the name
   of the SNS topic. This suffix needs to be unique in
   your AWS account.

   E.g. `my-channel` -> `chatbot-my-channel`

   This channel can then be used e.g. via

   aws sns publish --message "What a pretty day 🌻" --topic-arn "arn:aws:sns:my-region:123456789012:chatbot-my-channel"
   aws sns publish --subject "Hello world!" --message "What a pretty day 🌻" --topic-arn "arn:aws:sns:my-region:123456789012:chatbot-my-channel"
   aws sns publish --message '{"title":"Hello world!","body":"What a pretty day 🌻"}' --topic-arn "arn:aws:sns:my-region:123456789012:chatbot-my-channel"
   */
  notificationChannelName: string;

  // Other SNS topic props
  snsTopicProps?: Omit<aws_sns.TopicProps, 'topicName'>;
}

export class PostToSlack extends Construct {
  readonly slackLambda: NodejsFunction;

  // Create and export an SNS topic we can use to send messages
  // to the Slack channel using our custom payload
  readonly topicArn: string;
  readonly topic: aws_sns.Topic;

  constructor(scope: Construct, id: string, props: SlackLambdaProps) {
    super(scope, `${PostToSlack.name}-${id}`);

    const topicName = `chatbot-${props.notificationChannelName}`;

    // --- Configure the Lambda function that allows us to post messages to Slack ---

    this.slackLambda = new NodejsFunction(this, 'SlackLambda', {
      functionName: Stack.of(this).stackName + '-slack-' + topicName,
      entry: path.join(__dirname, '../lambda/process-message.ts'),
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      bundling: {
        externalModules: ['@aws-sdk/*'],
        minify: false
      },
      // The Lambda entrypoint name
      handler: 'index.handler',

      // Pass the SNS topic ARN to the function
      environment: {
        SNS_TOPIC_ARN: props.chatbotSNSTopicArn
      }
    });
    // Allow publishing to the SNS topic
    this.slackLambda.addToRolePolicy(
      new aws_iam.PolicyStatement({
        actions: ['sns:Publish'],
        effect: Effect.ALLOW,
        resources: [props.chatbotSNSTopicArn]
      })
    );

    // --- Configure the SNS topic we can expose to our organization ---

    // Pre-define the topic ARN in a way that doesn't tie us to the
    // generated CDK resource
    this.topicArn = Arn.format(
      {
        service: 'sns',
        resource: topicName
      },
      Stack.of(this)
    );
    this.topic = new aws_sns.Topic(this, 'SNSTopic', {
      topicName,
      ...props.snsTopicProps
    });

    // Subscribe the lambda to the SNS topic
    this.topic.addSubscription(
      new aws_sns_subscriptions.LambdaSubscription(this.slackLambda)
    );

    new CfnOutput(this, 'TopicArn', {
      value: this.topicArn
    });
  }
}
