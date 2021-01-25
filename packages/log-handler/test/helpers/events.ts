export const apiEvent = {
  data: { type: 's' }
};

export const loginEvent = {
  data: { type: 's' }
};

export const userBlockedEvent = {
  log_id: '90020210125134025627000057668264601332725329539796828258',
  data: {
    date: '2021-01-25T13:40:20.967Z',
    type: 'sapi',
    description: 'Update a user',
    details: {
      request: {
        method: 'patch',
        path: '/api/v2/users/auth0%7C597a065113f40b08485ee7bd',
        body: {
          blocked: true
        }
      },
      response: {
        statusCode: 200,
        body: {
          user_id: 'auth0|597a065113f40b08485ee7bd',
          blocked: true
        }
      }
    },
    log_id: '90020210125134025627000057668264601332725329539796828258'
  }
};
