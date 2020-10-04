function createAction(type, data) {
  return {type, data};
}

export function login(jwt, userId) {
  return {
    type: 'LOGIN_SUCCESS',
    data: {
      jwt, userId
    }
  }
}

export function updateUserList(userList) {
  return {
    type: 'UPDATE_USER_LIST',
    data: userList
  }
}

export function updateActiveConservationId(id) {
  return {
    type: 'SET_CURRENT_CONVERSATION_ID',
    data: id
  }
}

export function logout() {
  return {
    type: 'LOGOUT'
  }
}

export function webSocketConnected(webSocket, send, close) {
  return {
    type: 'WS_CONNECTED',
    data: {
      webSocket,
      send,
      close
    }
  }
}

export function receiveMessage(message) {
  return {
    type: 'CHAT_RECEIVE',
    data: message
  }
}

export function sendbackMessage(message) {
  return {
    type: 'CHAT_SENDBACK',
    data: message
  }
}

export function getMessageFromAPI(data, friendId) {
  data.friendId = friendId;
  return {
    type: 'GET_MSG_FROM_API',
    data
  }
}

export function onOffline(userId, status) {
  return {
    type: 'ONOFF',
    data: {
      userId, status
    }
  }
}

export function newUser(user) {
  return createAction('NEW_USER', user);
}

export function setSideBarActive(active) {
  return createAction("SIDEBAR_SET_ACTIVE", active);
}

export function toggleSideBar() {
  return createAction("TOGGLE_SIDE_BAR");
}

export function setSearchUserModalActive(active) {
  return createAction("SET_SEARCH_USER_MODAL_ACTIVE", active);
}

export function setTab(tab) {
  return createAction("SET_TAB", tab);
}

export function friendReload() {
  return createAction('FRIEND_RELOAD');
}

export function setWalletTab(tab) {
  return createAction('SET_WALLET_TAB', tab);
}
