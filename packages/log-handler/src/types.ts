export interface LogStreamingEvent {
  data: Record<string, any>;
}

export interface Event {
  type: string;

  user_id: string;
}

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
