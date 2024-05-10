import { aws_events } from 'aws-cdk-lib';

/**
 * SharedItems is a global struct that contains items shared
 * among multiple Stacks.
 *
 * To set and get items, use the `setSharedItem`/`getSharedItem` functions.
 */
export interface SharedItems {
  // eventBusShared is the core EventBus of the application
  eventBusShared: aws_events.EventBus;
}

// Initialize the struct as an empty object
const sharedItems: SharedItems = {} as never;

// setSharedItem sets an item in the SharedItems struct, and
// enforces type constraints (valid key, valid value)
export function setSharedItem<Key extends keyof SharedItems>(
  key: Key,
  value: SharedItems[Key]
) {
  sharedItems[key] = value;
}

// getSharedItem gets an item from the SharedItems struct, and
// enforces type constraints (valid key)
export function getSharedItem<Key extends keyof SharedItems>(
  key: Key
): SharedItems[Key] {
  const value = sharedItems[key];
  if (value === undefined) {
    throw new Error(`Tried to get a shared item before setting it: ${key}`);
  }
  return value;
}
