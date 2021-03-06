import React from 'react';
import {useSelector} from 'react-redux';
import './LeftSideBar.css';
import MenuBar from "../MenuBar";
import FriendTab from "../FriendTab";
import ChatTab from "../ChatTab";
import WalletTab from "../WalletTab";
import {useFriendList} from "../../hooks/friend";
import AddFriendModal from "../AddFriendModal";

export default function LeftSideBar() {
  let tab = useSelector(state => state.ui.currentTab);
  let sideBarActive = useSelector(state => state.ui.sideBarActive);

  useFriendList();

  let className = "left-sidebar";
  if (sideBarActive) {
    className += " active";
  }

  return (
    <div className={className}>
      <MenuBar/>
      {tab === 'chat' && <ChatTab/>}
      {tab === 'friend' && <FriendTab/>}
      {tab === 'wallet' && <WalletTab/>}
      <AddFriendModal/>
    </div>
  );
}

