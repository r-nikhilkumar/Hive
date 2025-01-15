import React from "react";
import { NavLink } from "react-router-dom";

function ProfileViewLinear({user}) {
  return (
      <NavLink
        to={`/chats/${user._id}`}
        className="user"
      >
        <img
          src={"/assets/icons/profile-placeholder.svg"}
          alt="profile"
          width={25}
          height={25}
        />
        <p className="name">{user.roomName}</p>
      </NavLink>
  );
}

export default ProfileViewLinear;
