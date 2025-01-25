import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { sidebarLinks } from "@/constants";
import { Button } from "@/components/ui/button";
import Loader from "./Loader";
import { useEffect, useState } from "react";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(pathname.startsWith("/chats"));
  const hasNotifications = true;
  const isLoading = false;
  const updatedLinks = sidebarLinks.map((link) => {
    if (link.label === "Notifications") {
      return {
        ...link,
        imgURL: hasNotifications
          ? "/assets/icons/notification-yes.svg"
          : "/assets/icons/notification-no.svg",
      };
    }
    return link;
  });


  useEffect(() => {
    // Automatically collapse the sidebar when on the "Chats" page
    if (pathname === "/chats" || pathname === "/pulse") {
      setIsCollapsed(true);
    }else{
      setIsCollapsed(false);
    }
  }, [pathname]);

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    navigate("/sign-in");
  };

  return (
    <nav className={"leftsidebar "+(isCollapsed ? "w-fit":"min-w-[250px]")}>
      <div className="flex flex-col gap-5">
        <span className="flex justify-between">
          <Link to="/" className="flex gap-3 items-center">
            <img
              src={`/assets/images/${
                isCollapsed ? "logo.png" : "full_logo_white_1.png"
              }`}
              alt="logo"
              width={isCollapsed ? 50 : 120}
              height={isCollapsed ? 50 : 120}
            />
          </Link>
        </span>

        <ul className="flex flex-col gap-3">
          {updatedLinks.map((link) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={
                  isCollapsed
                    ? "flex justify-center p-1 leftsidebar-link group"
                    : "leftsidebar-link group"
                }
                style={{ border: isActive ? "#877EFF 0.1em solid" : "" }}
              >
                <NavLink to={link.route} className="flex items-center p-2">
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                    width={25}
                    height={25}
                    title={isCollapsed ? link.label : ""}
                  />
                  {!isCollapsed && <p className="pl-3">{link.label}</p>}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {isLoading ? (
          <div className="h-14">
            <Loader />
          </div>
        ) : (
          <NavLink to={`/u/${1}`} className={`flex ${isCollapsed ? "justify-center" : "pl-2.5 items-center"}`}>
          <img
            src="/assets/icons/profile-placeholder.svg"
            alt="profile"
            width={25}
            height={25}
            title={isCollapsed ? "Profile" : ""}
          />
          {!isCollapsed && <p className="pl-3">Profile</p>}
        </NavLink>
        )}
      </div>

      <div>
        <Button
          variant="ghost"
          className="shad-button_ghost"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <img
            src={`/assets/icons/${
              isCollapsed ? "collapse1.svg" : "collapse2.svg"
            }`}
            alt="collapse"
            width={25}
            height={25}
            title={isCollapsed?"Expand":"Collapse"}
          />
        </Button>
        <Button
          variant="ghost"
          className="shad-button_ghost"
          onClick={(e) => handleSignOut(e)}
        >
          <img
            src="/assets/icons/logout.svg"
            alt="logout"
            width={25}
            height={25}
            title="Logout"
          />
          {/* <p className="small-medium lg:base-medium">Logout</p> */}
        </Button>
      </div>
    </nav>
  );
};

export default LeftSidebar;
