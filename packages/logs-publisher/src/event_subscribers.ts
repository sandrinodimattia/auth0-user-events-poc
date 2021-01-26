import parse from './lib/parsers';
import { WorkerEnvironment } from './lib/types';
import { handleErrors, getPath, jsonResponse, wsResponse, notFoundError, badRequestError } from './lib/utils';

interface Session {
  webSocket: any;
}

export default class EventSubscribers {
  private env: WorkerEnvironment;

  private pingTimer: any;

  /**
   * Our connected sessions.
   */
  private sessions: Array<Session>;

  constructor(controller: DurableObjectState, env: WorkerEnvironment) {
    this.env = env;
    this.sessions = [];
  }

  fetch(request: Request): Promise<Response> {
    return handleErrors(request, async () => {
      const path = getPath(request.url);
      switch (path) {
        case '/api/subscribe':
          return this.subscribe(request);
        case '/api/publish':
          return this.broadcast(request);
        default:
          return notFoundError(`The path ${path} was not found`);
      }
    });
  }

  /**
   * Accept the websocket request from any client that wishes to subscribe.
   * @param request Request
   */
  async subscribe(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return badRequestError('Expected a Websocket request');
    }

    const pair = new WebSocketPair();
    const serverSocket = pair[1];
    serverSocket.accept();
    serverSocket.send(
      JSON.stringify({
        type: 'connected'
      })
    );

    serverSocket.addEventListener('ping', async () => {
      serverSocket.pong();
    });

    // Create our session and add it to the sessions list.
    const session = { webSocket: serverSocket };
    this.sessions.push(session);

    // On "close" and "error" events, remove the WebSocket from the sessions list.
    let closeOrErrorHandler = () => {
      this.sessions = this.sessions.filter((member) => member !== session);
    };
    serverSocket.addEventListener('close', closeOrErrorHandler);
    serverSocket.addEventListener('error', closeOrErrorHandler);

    const clientSocket = pair[0];
    return wsResponse(clientSocket);
  }

  async broadcast(request: Request): Promise<Response> {
    const body = await request.json();
    const events = await body.map((e: any) => parse(e)).filter((e: any) => e != null);

    const jsonEvents = events.map((e: any) => JSON.stringify(e));

    this.sessions = this.sessions.filter((session) => {
      try {
        jsonEvents.forEach((e: any) => session.webSocket.send(e));
        return true;
      } catch (err) {
        // Whoops, this connection is dead. Remove it from the list.
        return false;
      }
    });

    return jsonResponse({ received: body.length, events });
  }
}
