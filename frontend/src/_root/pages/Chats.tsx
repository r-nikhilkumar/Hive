import ChatSidebar from "@/components/shared/chats/ChatSidebar";
import { Button } from "@/components/ui";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

function Chats() {
  const { pathname } = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
    // Listen for window resize changes
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
  
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  return (
    <div className="w-full md:flex">
      <ChatSidebar />

      {/* <section className="flex flex-1 pb-12"> */}
        {pathname == "/chats" && !isMobile ? (
          <div className="flex justify-center items-center w-full">
            <Button
              type="submit"
              className="shad-button_primary space-y-3 w-fit"
            >
              Start Chatting
            </Button>
          </div>
        ) : (
          <Outlet />
        )}
      {/* </section> */}
    </div>
  );
}

export default Chats;
