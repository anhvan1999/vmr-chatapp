import React, {useEffect, useState} from 'react';
import './HistoryItem.css';
import {Col, Row} from 'antd';
import UserAvatar from '../UserAvatar';
import {moneyFormat, timestampSecond2String} from '../../util/string-util';
import {useSelector} from 'react-redux';
import {getUserInfo} from "../../service/friend";
import NewLineText from "../NewLineText";

const {HistoryResponse} = require('../../proto/vmr/wallet_pb');

export default function HistoryItem(props) {
  let {type, amount, timestamp, message, friendId} = props;
  let [friendName, setFriendName] = useState('...');
  let msg = 'Chuyển tiền tới';
  let sign = '-';
  let className = 'history-item';
  let friend = useSelector(state => state.friends.friends[friendId]);

  // eslint-disable-next-line
  useEffect(() => {
    if (!friend) {
      getUserInfo(friendId).then(result => {
        setFriendName(result.getName());
      });
    } else {
      setFriendName(friend.name);
    }
  });

  if (type === HistoryResponse.Type.RECEIVE) {
    msg = "Nhận tiền từ";
    sign = "+";
    className += ' receive';
  }

  return (
    <div className={className}>
      <Row>
        <Col span={4} className={'icon-col'}>
          <UserAvatar name={friendName} size={40}/>
        </Col>
        <Col span={20}>
          <Row>
            <Col xs={24} md={18}>
              <p className={'content'}>{msg} {friendName}</p>
              <p className={'time'}>{timestampSecond2String(timestamp)}</p>
              <NewLineText text={message}/>
            </Col>
            <Col xs={24} md={6} className={'money-col'}>
              <span className={'amount'}>{sign} {moneyFormat(amount)} VNĐ</span>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
};
