export function login(jwt, userId) {
  return {
    type: 'LOGIN_SUCCESS',
    data: {
      jwt, userId
    }
  }
}