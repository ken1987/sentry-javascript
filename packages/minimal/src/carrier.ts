/* eslint-disable max-lines */
import { CarrierV7, ClientLike, EventProcessor, ScopeLike } from '@sentry/types';
import { getGlobalObject, logger } from '@sentry/utils';

// TODO: Global event processors should be removed in favor of client/scope processors - need to remove all `addGloblaEventProcessors` from integrations first.
/**
 * Retruns the global event processors.
 */
export function getGlobalEventProcessors(): EventProcessor[] {
  /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access  */
  const global = getGlobalObject<any>();
  global.__SENTRY__ = global.__SENTRY__ || {};
  global.__SENTRY__.globalEventProcessors = global.__SENTRY__.globalEventProcessors || [];
  return global.__SENTRY__.globalEventProcessors;
  /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */
}

/**
 * Add a EventProcessor to be kept globally.
 * @param callback EventProcessor to add
 */
export function addGlobalEventProcessor(callback: EventProcessor): void {
  getGlobalEventProcessors().push(callback);
}

// TODO: We need to get rid of current implementation from Hub
function getMainCarrier(): CarrierV7 {
  const global = getGlobalObject();
  global.__SENTRY_V7__ = global.__SENTRY_V7__ || {};
  return global.__SENTRY_V7__;
}

export function getCurrentClient(): ClientLike | undefined {
  const carrier = getMainCarrier();
  if (!carrier.client) {
    logger.warn('No client available on the carrier.');
    return;
  }
  return carrier.client;
}

export function getCurrentScope(): ScopeLike | undefined {
  const carrier = getMainCarrier();
  if (!carrier.scope) {
    logger.warn('No scope available on the carrier.');
    return;
  }
  return carrier.scope;
}
