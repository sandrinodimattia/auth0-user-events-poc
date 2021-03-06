import parse from '../../../src/lib/parsers';
import { loginEvent, userBlockedEvent } from '../../helpers/events';

describe('parse', () => {
  it('should return null if the event cannot be parsed', async () => {
    const event = parse(loginEvent);
    expect(event).toBeNull();
  });

  it('should parse the event', async () => {
    const event = parse(userBlockedEvent);
    expect(event).toEqual({
      date: '2021-01-25T13:40:20.967Z',
      type: 'user_blocked',
      user_id: 'auth0|597a065113f40b08485ee7bd'
    });
  });
});
