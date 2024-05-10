import * as cdk from 'aws-cdk-lib';
import { aws_events } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { setSharedItem } from './util/shared';

export class EventsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const eventBus = new aws_events.EventBus(this, 'EventBusShared');

    // Set the EventBus as a global element
    setSharedItem('eventBusShared', eventBus);
  }
}
