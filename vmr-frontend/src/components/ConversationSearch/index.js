import React from 'react';
import {Button} from 'antd';
import './ConversationSearch.css';
import {useDispatch} from "react-redux";
import {setSearchUserModalActive} from "../../redux/vmr-action";
import {PlusOutlined} from "@ant-design/icons";

let buttonStyle = {
  height: "38px",
  width: "30%",
  borderRadius: 0,
  borderTopRightRadius: "5px",
  borderBottomRightRadius: "5px"
}

export default function ConversationSearch() {
  let dispatch = useDispatch();

  let handleClick = () => {
    dispatch(setSearchUserModalActive(true));
  }

  return (
    <div className="conversation-search">
      <input
        type="search"
        className="conversation-search-input"
        placeholder="Tìm bạn bè"
      />
      <Button type="primary" style={buttonStyle} onClick={handleClick}><PlusOutlined/>Thêm</Button>
    </div>
  );
}
