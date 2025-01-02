import React, { useEffect, useRef } from "react";
import { PulseVideo } from "@/components/shared/PulseVideo";

const Pulse = () => {
  const containerRef = useRef(null);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown" && containerRef.current) {
      // Scroll to the next video
      const container = containerRef.current;
      const currentScroll = container.scrollTop;
      const height = window.innerHeight;
      container.scrollTo({
        top: currentScroll + height,
        behavior: "smooth",
      });
    }
    if (event.key === "ArrowUp" && containerRef.current) {
      // Scroll to the previous video
      const container = containerRef.current;
      const currentScroll = container.scrollTop;
      const height = window.innerHeight;
      container.scrollTo({
        top: currentScroll - height,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const videos = [
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    "https://www.w3schools.com/html/movie.mp4",
  ];

  // const scrollTo = (direction : any) => {
  //   if (containerRef.current) {
  //     const container = containerRef.current;
  //     const currentScroll = container.scrollTop;
  //     const height = window.innerHeight;
  //     container.scrollTo({
  //       top:
  //         direction === "down"
  //           ? currentScroll + height
  //           : currentScroll - height,
  //       behavior: "smooth",
  //     });
  //   }
  // };

  return (
    <div className="flex justify-center w-full">
      <div
        ref={containerRef}
        className="overflow-y-scroll h-screen snap-y snap-mandatory bg-black no-scrollbar relative"
      >
        {videos.map((video, index) => (
          <PulseVideo key={index} src={video} />
        ))}
      </div>
    </div>
  );
};

export default Pulse;
