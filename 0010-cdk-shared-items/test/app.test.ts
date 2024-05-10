import { ProducerStack } from '../lib/producer-stack';
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { getSharedItem } from '../lib/util/shared';
import { EventsStack } from '../lib/events-stack';
import { ConsumerStack } from '../lib/consumer-stack';

test('SharedItems utility', async () => {
  const app = new App();

  // Getting a shared item before it has been set should fail
  expect(() => getSharedItem('eventBusShared')).toThrow(
    'Tried to get a shared item before setting it: eventBusShared'
  );

  // Create the EventStack, which sets our shared item
  const eventsStack = new EventsStack(app, 'Events');
  expect(getSharedItem('eventBusShared')).not.toBeUndefined();

  // Init the other stacks
  const producerStack = new ProducerStack(app, 'Producer');
  const consumerStack = new ConsumerStack(app, 'Consumer');

  {
    const template = Template.fromStack(eventsStack);
    expect(template).toMatchSnapshot();
  }
  {
    const template = Template.fromStack(producerStack);
    expect(template).toMatchSnapshot();
  }
  {
    const template = Template.fromStack(consumerStack);
    expect(template).toMatchSnapshot();
  }
});
