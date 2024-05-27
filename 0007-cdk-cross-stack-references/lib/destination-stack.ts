/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import * as cdk from 'aws-cdk-lib';
import {
  Arn,
  aws_cloudwatch,
  aws_cloudwatch_actions,
  aws_sns,
  aws_ssm,
  Duration
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export type DestinationStackProps = cdk.StackProps & {
  snsTopicForAlarms?: aws_sns.Topic;
  snsTopicForAlarmsName?: string;
  snsTopicForAlarmsParameterName?: string;
};

export class DestinationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: DestinationStackProps) {
    super(scope, id, props);

    if (
      props.snsTopicForAlarms == null &&
      props.snsTopicForAlarmsName == null &&
      props.snsTopicForAlarmsParameterName == null
    ) {
      throw new Error(
        `You have to provide either snsTopicForAlarms, snsTopicForAlarmsName or snsTopicForAlarmsParameterName`
      );
    }

    let snsTopicForAlarms: aws_sns.ITopic;

    if (props.snsTopicForAlarms) {
      // Use the directly passed SNS topic resource (via
      // transparent CfnOutput)
      snsTopicForAlarms = props.snsTopicForAlarms;
    } else if (props.snsTopicForAlarmsName) {
      // Load the name of the SNS topic from a hard-coded name
      snsTopicForAlarms = aws_sns.Topic.fromTopicArn(
        this,
        'SNSTopicForAlarms',
        Arn.format(
          {
            service: 'sns',
            resource: 'topic',
            resourceName: props.snsTopicForAlarmsName
          },
          this
        )
      );
    } else if (props.snsTopicForAlarmsParameterName) {
      // Load the name of the SNS topic from a SSM parameter
      const parameter = aws_ssm.StringParameter.fromStringParameterName(
        this,
        'TopicNameParameter',
        props.snsTopicForAlarmsParameterName
      );
      // Import the SNS topic using the ARN stored in the SSM parameter
      snsTopicForAlarms = aws_sns.Topic.fromTopicArn(
        this,
        'SNSTopicForAlarms',
        parameter.stringValue
      );
    } else {
      throw new Error('Bad configuration');
    }

    // Define a generic metric we want to keep track of
    const metricEvents = new aws_cloudwatch.Metric({
      namespace: 'AWS/Events',
      metricName: 'InvocationsCreated',
      statistic: 'sum',
      period: Duration.minutes(1)
    });

    // Define a generic alarm
    const alarmEvents = new aws_cloudwatch.Alarm(this, 'Alarm1', {
      metric: metricEvents,
      threshold: 100000,
      evaluationPeriods: 3
    });

    // Here, we want to add an action to the alarm, which will send a
    // message to the SNS topic.
    alarmEvents.addAlarmAction(
      new aws_cloudwatch_actions.SnsAction(snsTopicForAlarms)
    );
  }
}
