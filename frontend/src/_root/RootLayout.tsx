import { Outlet } from "react-router-dom";

import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import { useEffect, useState } from "react";

const RootLayout = () => {
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
      <Topbar />
      <LeftSidebar />

      <section className={isMobile ? "flex flex-1 pb-10" : "flex flex-1 h-full"}>
        <Outlet />
      </section>

      <Bottombar />
    </div>
  );
};

export default RootLayout;
