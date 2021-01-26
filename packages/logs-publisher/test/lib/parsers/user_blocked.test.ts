import UserBlockedEventParser from '../../../src/lib/parsers/user_blocked';
import { apiEvent, loginEvent, userBlockedEvent } from '../../helpers/events';

describe('UserBlockedEventParser', () => {
  it('should not match other events', async () => {
    const parser = new UserBlockedEventParser();
    const match = parser.canHandle(loginEvent);
    expect(match).not.toBe(true);
  });

  it('should not match other API v2 events', async () => {
    const parser = new UserBlockedEventParser();
    const match = parser.canHandle(apiEvent);
    expect(match).not.toBe(true);
  });

  it('should not match user blocked events', async () => {
    const parser = new UserBlockedEventParser();
    const match = parser.canHandle(userBlockedEvent);
    expect(match).toBe(true);
  });

  it('should parse the event', async () => {
    const parser = new UserBlockedEventParser();
    const event = parser.parse(userBlockedEvent);
    expect(event).toEqual({
      date: '2021-01-25T13:40:20.967Z',
      type: 'user_blocked',
      user_id: 'auth0|597a065113f40b08485ee7bd'
    });
  });
});
