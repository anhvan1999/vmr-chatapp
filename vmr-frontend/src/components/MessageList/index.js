import React, {useEffect, useState} from 'react';
import Compose from '../Compose';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import Message from '../Message';
import {Switch, Route} from 'react-router-dom';
import moment from 'moment';
import logout from "../../service/logout";
import {connect} from 'react-redux';

import './MessageList.css';

const MY_USER_ID = 'apple';


let MessageList = (props) => {
  if (props.userMap.size === 0) {
    return <div></div>;
  }

  let userId = props.match.params.receiverId;
  console.log(props.userMap);
  console.log(userId);
  let user = props.userMap.get(Number(userId));
  console.log(user);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getMessages();
  }, []);

  const getMessages = () => {
    let tempMessages = [
      {
        id: 1,
        author: 'apple',
        message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
        timestamp: new Date().getTime()
      },
      {
        id: 2,
        author: 'orange',
        message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
        timestamp: new Date().getTime()
      },
      {
        id: 3,
        author: 'orange',
        message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
        timestamp: new Date().getTime()
      },
      {
        id: 4,
        author: 'apple',
        message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
        timestamp: new Date().getTime()
      },
      {
        id: 5,
        author: 'apple',
        message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
        timestamp: new Date().getTime()
      },
      {
        id: 6,
        author: 'apple',
        message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
        timestamp: new Date().getTime()
      },
      {
        id: 7,
        author: 'orange',
        message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
        timestamp: new Date().getTime()
      },
      {
        id: 8,
        author: 'orange',
        message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
        timestamp: new Date().getTime()
      },
      {
        id: 9,
        author: 'apple',
        message: 'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
        timestamp: new Date().getTime()
      },
      {
        id: 10,
        author: 'orange',
        message: 'It looks like it wraps exactly as it is supposed to. Lets see what a reply looks like!',
        timestamp: new Date().getTime()
      },
    ]
    setMessages([...messages, ...tempMessages])
  }

  const renderMessages = () => {
    let i = 0;
    let messageCount = messages.length;
    let tempMessages = [];

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.author === MY_USER_ID;
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(currentMoment.diff(previousMoment));
        prevBySameAuthor = previous.author === current.author;

        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false;
        }

        if (previousDuration.as('hours') < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as('hours') < 1) {
          endsSequence = false;
        }
      }

      tempMessages.push(
        <Message
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />
      );

      // Proceed to the next message.
      i += 1;
    }

    return tempMessages;
  }

  return (
    <div className="message-list">
      <Toolbar
        title={user.name}
        rightItems={[
          <ToolbarButton key="signout" icon="ion-ios-log-out" onClick={() => logout()}/>,
          <ToolbarButton key="info" icon="ion-ios-information-circle-outline"/>,
          <ToolbarButton key="video" icon="ion-ios-videocam"/>,
          <ToolbarButton key="phone" icon="ion-ios-call"/>,
        ]}
      />

      <div className="message-list-container">{renderMessages()}</div>

      <Compose rightItems={[
        <ToolbarButton key="photo" icon="ion-ios-camera"/>,
        <ToolbarButton key="image" icon="ion-ios-image"/>,
        <ToolbarButton key="audio" icon="ion-ios-mic"/>,
        <ToolbarButton key="money" icon="ion-ios-card"/>,
        <ToolbarButton key="games" icon="ion-logo-game-controller-b"/>,
        <ToolbarButton key="emoji" icon="ion-ios-happy"/>
      ]}/>
    </div>
  );
}

let mapStateToPropsMessageList = (state) => {
  return {
    userMap: state.userMap
  }
}

MessageList = connect(mapStateToPropsMessageList, null)(MessageList);

export default function MessageListWrapper() {
  return (
    <Switch>
      <Route path="/t/:receiverId" component={MessageList}/>
      <Route exact path="/">
        <div></div>
      </Route>
    </Switch>
  );
}