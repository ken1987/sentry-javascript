import { getCurrentHub } from '@sentry/hub';
import { CustomSamplingContext, ScopeLike, Transaction, TransactionContext } from '@sentry/types';

import { getCurrentScope } from './carrier';

export {
  addGlobalEventProcessor,
  getCarrier,
  getCurrentClient,
  getCurrentScope,
  getGlobalEventProcessors,
} from './carrier';
export { captureException, captureMessage, captureEvent, close, flush, lastEventId } from './client';
export {
  addBreadcrumb,
  getSpan,
  getTransaction,
  setContext,
  setExtra,
  setExtras,
  setSpan,
  setTag,
  setTags,
  setUser,
} from './scope';

export function configureScope(callback: (scope: ScopeLike) => void): void {
  const scope = getCurrentScope();
  if (scope) {
    callback(scope);
  }
}

export function withScope(callback: (scope: ScopeLike) => void): void {
  const scope = getCurrentScope()?.clone();
  if (scope) {
    try {
      callback(scope);
    } catch (_oO) {
      // no-empty
    }
  }
}

// TODO: Restore this functionality without using extensions and remove hub from deps
export function startTransaction(
  context: TransactionContext,
  customSamplingContext?: CustomSamplingContext,
): Transaction {
  return getCurrentHub().startTransaction({ ...context }, customSamplingContext);
}
