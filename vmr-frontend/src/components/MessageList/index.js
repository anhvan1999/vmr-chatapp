import React, {useEffect, useRef} from 'react';
import Compose from '../Compose';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import {connect} from 'react-redux';
import {getMessageFromAPI, updateActiveConservationId} from '../../redux/vmr-action';
import {getMessageList} from '../../service/message-list';
import renderMessageNew from './message-render';

import './MessageList.css';

let MessageListInternal = props => {
  let {scrollFlag, currentConversationId, receiverId, receiver, webSocket} = props;

  // Use to scroll message
  let endOfMsgList = useRef(null);
  let msgList = useRef(null);

  let messageList = props.chatMessages;

  // Scroolflag and conversationid

  // Messages list
  let messages = messageList.map((x) => {
    return {
      id: x.timestamp,
      message: x.message,
      author: x.senderId,
      timestamp: x.timestamp * 1000,
      isMine: x.isMine
    };
  });

  // Load message
  useEffect(
    () => {
      props.updateConversationId(receiverId);
      if (messageList.length === 0) {
        getMessageList(receiverId, messageList.length).then((data) => {
          props.updateMessageList(data, receiverId);
          endOfMsgList.current.scrollIntoView({behavior: 'smooth'});
        });
      }
    },
    [receiverId]
  );

  // Scroll to bottom of message list
  useEffect(
    () => {
      endOfMsgList.current.scrollIntoView({behavior: 'smooth'});
    },
    [scrollFlag, currentConversationId]
  );

  // Load more message
  let msgScrollHandle = (event) => {
    let msgList = event.target;
    let offset = msgList.scrollTop;
    if (offset === 0) {
      getMessageList(receiverId, messageList.length).then((data) => {
        let oldHeight = msgList.scrollHeight;
        props.updateMessageList(data, receiverId);
        let newHeight = msgList.scrollHeight;
        msgList.scrollTo(0, newHeight - oldHeight);
      });
    }
  };

  let onChangeText = (event) => {
    if (event.keyCode === 13 && event.target.value !== '') {
      webSocket.send(receiverId, event.target.value);
      event.target.value = '';
    }
  };

  return (
    <div className="message-list">
      <Toolbar
        title={receiver.name}
        rightItems={[
          <ToolbarButton key="info" icon="ion-ios-information-circle-outline"/>,
          <ToolbarButton key="video" icon="ion-ios-videocam"/>,
          <ToolbarButton key="phone" icon="ion-ios-call"/>
        ]}
      />

      <div className="message-list-container" ref={msgList} onScroll={msgScrollHandle}>
        {renderMessageNew(messages)}
        <div ref={endOfMsgList} style={{height: '0px'}}/>
      </div>

      <Compose
        rightItems={[
          <ToolbarButton key="photo" icon="ion-ios-camera"/>,
          <ToolbarButton key="audio" icon="ion-ios-mic"/>,
          <ToolbarButton key="emoji" icon="ion-ios-happy"/>
        ]}
        onKeyUp={onChangeText}
      />
    </div>
  );
};

let MessageList = props => {
  if (!props.isValid()) {
    return null;
  }

  // Get receiver
  let receiverId = Number(props.match.params.receiverId);

  return <MessageListInternal {...props} receiverId={receiverId}/>
};

// Map from redux to props
let stateToProps = (state, ownProp) => {
  let receiverId = Number(ownProp.match.params.receiverId);

  try {
    return {
      chatMessages: state.chat.chatMessagesHolder.chatMessages.get(receiverId),
      receiver: state.users.userMapHolder.userMap.get(receiverId),
      webSocket: state.app.webSocket,
      scrollFlag: state.chat.scrollFlag,
      currentConversationId: state.users.currentConversationId,
      isValid: function () {
        return this.chatMessages != null && this.receiver != null;
      }
    };
  } catch (e) {
    return {
      showFlag: false
    }
  }
};

let dispatchToProps = (dispatch) => {
  return {
    updateMessageList: (data, friendId) => {
      dispatch(getMessageFromAPI(data, friendId));
    },
    updateConversationId: (id) => {
      dispatch(updateActiveConservationId(id));
    }
  };
};

export default connect(stateToProps, dispatchToProps)(MessageList);
