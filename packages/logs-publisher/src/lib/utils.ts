/**
 * Dispatch the request to the durable object.
 * @param request Request
 * @param ns DurableObjectNamespace
 */
export const dispatch = (request: Request, ns: DurableObjectNamespace, name: string): Promise<Response> => {
  const id = ns.idFromName(name);
  const instance = ns.get(id);
  return instance.fetch(request);
};

/**
 * Return a JSON response
 * @param obj
 */
export const jsonResponse = (obj: unknown): Response =>
  new Response(JSON.stringify(obj), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=UTF-8' }
  });

/**
 * Return a "Bad Request" error
 * @param url string
 */
export const badRequestError = (message: string): Response =>
  new Response(JSON.stringify({ error: 'bad_request', error_description: message }), {
    status: 400,
    headers: { 'Content-Type': 'application/json; charset=UTF-8' }
  });

/**
 * Return a "Not Found" error
 * @param url string
 */
export const notFoundError = (message: string): Response =>
  new Response(JSON.stringify({ error: 'not_found', error_description: message }), {
    status: 404,
    headers: { 'Content-Type': 'application/json; charset=UTF-8' }
  });

/**
 * Return a websocket response.
 * @param socket One side of the pair.
 */
export const wsResponse = (socket: unknown): Response => {
  const responseInit: any = { status: 101, webSocket: socket };
  return new Response(null, responseInit);
};

/**
 * Extract the path of the URL.
 * @param url
 */
export const getPath = (url: string): string => new URL(url).pathname;

interface RequestHandler {
  (): Promise<Response>;
}

/**
 * Handle any uncaught errors.
 * @param request Request
 * @param fn RequestHandler
 */
export const handleErrors = async (request: Request, fn: RequestHandler): Promise<Response> => {
  try {
    return await fn();
  } catch (err) {
    if (request.headers.get('Upgrade') === 'websocket') {
      const pair = new WebSocketPair();
      pair[1].accept();
      pair[1].send(JSON.stringify({ error: err.stack }));
      pair[1].close(1011, 'Uncaught exception during session setup');
      return wsResponse(pair[0]);
    }

    return new Response(err.stack, { status: 500 });
  }
};
