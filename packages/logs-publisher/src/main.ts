import { WorkerEnvironment } from './lib/types';
import { dispatch, getPath, handleErrors, notFoundError } from './lib/utils';

export { default as EventSubscribers } from './event_subscribers';

/**
 * The default entrypoint of the worker.
 */
export default {
  fetch(request: Request, env: WorkerEnvironment): Promise<Response> {
    return handleErrors(request, async () => {
      const { eventSubscribers } = env;
      const path = getPath(request.url);
      const tenant = 'acme.auth0.com';

      switch (path) {
        case '/api/subscribe':
        case '/api/publish':
          return dispatch(request, eventSubscribers, tenant);
        default:
          return notFoundError(`The path ${path} was not found`);
      }
    });
  }
};
