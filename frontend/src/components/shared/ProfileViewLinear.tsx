import React from "react";
import { NavLink } from "react-router-dom";

function ProfileViewLinear({chatRoom}) {
  return (
      <NavLink
        to={`/chats/${chatRoom._id}`}
        className="user"
      >
        <img
          src={chatRoom.roomAvatar || "/assets/icons/profile-placeholder.svg"}
          alt="profile"
          width={25}
          height={25}
        />
        <p className="name">{chatRoom.roomName}</p>
      </NavLink>
  );
}

export default ProfileViewLinear;
