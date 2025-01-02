import { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { Button } from "../ui/button";

const Topbar = () => {
  const navigate = useNavigate();
  const isSuccess = false;
  const hasNotifications = true;

  const signOut = ()=>{
    navigate("/sign-in")
    console.log("signed out")
  }

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/full_logo_white_1.png"
            alt="logo"
            width={100}
            height={100}
          />
          {/* <h2 className="text-xl">Hive</h2> */}
        </Link>

        <div className="flex gap-4">
          {/* <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}>s
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button> */}
          <Link to={`/notification`} className="flex-center gap-3">
            <img src={hasNotifications ? "/assets/icons/notification-yes.svg" : "/assets/icons/notification-no.svg"} alt="notification" width={34}/>
          </Link>
          <Link to={`/chats`} className="flex-center gap-3">
            <img src="/assets/icons/chat.svg" alt="chat" width={34}/>
          </Link>
          <Link to={`/u/${"user.id"}`} className="flex-center gap-3">
            <img
              src={"/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
