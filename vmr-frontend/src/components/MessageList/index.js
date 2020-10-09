import React, {useEffect, useRef, useState} from 'react';
import Compose from '../Compose';
import ToolbarButton from '../ToolbarButton';
import TitleBar from '../TitleBar';
import {useDispatch, useSelector} from 'react-redux';
import {clearNotifications, getMessageFromAPI, updateCurrentFriend} from '../../redux/vmr-action';
import {getMessageList} from '../../service/message-list';
import renderMessageNew from './message-render';
import {SendOutlined, DollarCircleOutlined} from '@ant-design/icons';
import TransferMoneyModal from "../TransferMoneyModal";

import './MessageList.css';
import {clearUnreadMessage} from "../../service/friend";

function MessageListInternal(props) {
  let {receiverId} = props;

  // Selectors
  let scrollFlag = useSelector(state => state.chat.scrollFlag);
  let webSocket = useSelector(state => state.webSocket);
  let currentFriendId = useSelector(state => state.friends.currentFriendId);
  let chatMessages = useSelector(state => state.chat.messages[receiverId]);
  let receiver = useSelector(state => state.friends.friends[receiverId]);

  // Dispatch
  let dispatch = useDispatch();

  let updateMessageList = (data, friendId) => {
    dispatch(getMessageFromAPI(data, friendId));
  };

  let updateConversationId = (id) => {
    dispatch(updateCurrentFriend(id));
  };

  let clearChatNotifications = () => {
    dispatch(clearNotifications(receiverId));
  };

  // Use to scroll message
  let endOfMsgList = useRef(null);
  let msgList = useRef(null);
  let inputRef = useRef(null);
  let [sendButtonActive, setSendBtnActive] = useState(false);
  let [moneyTransferActive, setMoneyTransferActive] = useState(false);

  // Message list
  let messages = chatMessages.map(x => {
    return {
      id: x.timestamp,
      message: x.message,
      author: x.senderId,
      timestamp: x.timestamp * 1000,
      isMine: x.isMine,
      transfer: x.type === 'TRANSFER'
    };
  });

  // Load message
  useEffect(
    () => {
      updateConversationId(receiverId);
      if (chatMessages.length === 0) {
        getMessageList(receiverId, chatMessages.length).then((data) => {
          updateMessageList(data, receiverId);
          let {current} = endOfMsgList;
          if (current) {
            current.scrollIntoView();
          }
        });
      }
      clearUnreadMessage(receiverId);
    },
    // eslint-disable-next-line
    [receiverId]
  );

  // Scroll to bottom of message list
  useEffect(
    () => {
      let {current} = endOfMsgList;
      if (current) {
        current.scrollIntoView();
      }
    },
    [scrollFlag, currentFriendId]
  );

  // Load more message
  let msgScrollHandle = (event) => {
    let msgList = event.target;
    let offset = msgList.scrollTop;
    if (offset === 0) {
      getMessageList(receiverId, chatMessages.length).then((data) => {
        let oldHeight = msgList.scrollHeight;
        updateMessageList(data, receiverId);
        let newHeight = msgList.scrollHeight;
        msgList.scrollTo(0, newHeight - oldHeight);
      });
    }
  };

  // Send btn handle
  let handleSendButtonClick = () => {
    let {value} = inputRef.current;
    if (value !== '') {
      webSocket.send(receiverId, value);
    }
    inputRef.current.value = '';
    setSendBtnActive(false);
  };

  // Handle text change
  let onChangeText = (event) => {
    if (event.target.value !== '') {
      setSendBtnActive(true);
    } else {
      setSendBtnActive(false);
    }
    if (event.keyCode === 13 && event.target.value !== '') {
      handleSendButtonClick();
    }
  };

  let openTransferModal = () => {
    setMoneyTransferActive(true);
  };

  return (
    <div className="message-list" onFocus={clearChatNotifications}>
      <TitleBar title={receiver.name}/>

      <div className="message-list-container" ref={msgList} onScroll={msgScrollHandle}>
        {renderMessageNew(messages)}
        <div ref={endOfMsgList} style={{height: '0px'}}/>
      </div>

      <Compose
        rightItems={[
          <ToolbarButton
            key="transfer"
            icon={<DollarCircleOutlined/>}
            onClick={openTransferModal}
            type="compose-btn"
            style={{color: '#d49311'}}
          />,
          <ToolbarButton
            key="send" icon={<SendOutlined/>}
            onClick={handleSendButtonClick}
            active={sendButtonActive}
            type="compose-btn"/>
        ]}
        onKeyUp={onChangeText}
        inputRef={inputRef}
      />

      <TransferMoneyModal
        receiverId={receiver.id}
        active={moneyTransferActive}
        setActive={setMoneyTransferActive}
        receiverName={receiver.name}
      />
    </div>
  );
}

export default function MessageList(props) {
  // Get receiver
  let receiverId = Number(props.match.params.receiverId);

  // Check receiver
  let chatMessages = useSelector(state => state.chat.messages[receiverId]);
  let receiver = useSelector(state => state.friends.friends[receiverId]);

  // If chat message and recevier not exist in redux
  if (!chatMessages || !receiver) {
    return null;
  }

  // Render internal component
  return <MessageListInternal receiverId={receiverId}/>
};
