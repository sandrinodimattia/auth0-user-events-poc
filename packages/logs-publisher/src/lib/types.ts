declare global {
  /**
   * Undocumented websockets object.
   */
  const WebSocketPair: any;
}

/**
 * The Cloudflare Worker environment.
 */
export interface WorkerEnvironment {
  eventSubscribers: DurableObjectNamespace;
}

/**
 * An Auth0 Log Stream event.
 */
export interface LogStreamingEvent {
  data: Record<string, any>;
}

/**
 * A user event.
 */
export interface Event {
  type: string;
  date: string;
  user_id: string;
}

/**
 * A parser which can convert a Log Streaming Event to an Event.
 */
export interface EventParser {
  /**
   * Check if the parser can handle this event or not.
   * @param event An event received from the Auth0 Log Streaming integration.
   */
  canHandle(event: LogStreamingEvent): boolean;

  /**
   * Parse the event to a format we like.
   * @param event An event received from the Auth0 Log Streaming integration.
   */
  parse(event: LogStreamingEvent): Event;
}
