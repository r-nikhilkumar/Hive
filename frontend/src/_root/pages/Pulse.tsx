import { useEffect, useRef, useState } from "react";
import { PulseVideo } from "@/components/shared/PulseVideo";
import { useGetPulseVideosQuery } from "@/redux/api/postApi";
import { HashLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { useGetUserByIdQuery } from "@/redux/api/userApi";

const Pulse = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { data, isLoading, isError } = useGetPulseVideosQuery(undefined);
  const userId = useSelector((state: any) => state.auth.userId);
  const [isMuted, setIsMuted] = useState(true);
  const { data: userDetails, isLoading: isUserDetailsLoading } =
    useGetUserByIdQuery(userId, { skip: !userId });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const currentScroll = container.scrollTop;
      const height = window.innerHeight;

      if (event.key === "ArrowDown") {
        // Scroll to the next video
        container.scrollTo({
          top: currentScroll + height,
          behavior: "smooth",
        });
      } else if (event.key === "ArrowUp") {
        // Scroll to the previous video
        container.scrollTo({
          top: currentScroll - height,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    // Attach the native KeyboardEvent listener
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      // Cleanup the event listener on component unmount
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isLoading || isUserDetailsLoading)
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <HashLoader color="#F87171" loading={isLoading} size={40} />
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center items-center h-screen w-full">
        Error loading videos
      </div>
    );

  return (
    <div className="fixed justify-center w-full z-20 bg-dark-3 top-0 bottom-0">
      <div
        ref={containerRef}
        className="overflow-y-scroll h-screen snap-y snap-mandatory bg-dark-3 no-scrollbar relative"
      >
        {data?.data?.map((video: any, index: number) => (
          video.content.map((contentUrl: string, contentIndex: number) => (
            contentUrl.endsWith(".mp4") && (
              <PulseVideo
                key={`${index}-${contentIndex}`}
                src={contentUrl}
                video={video}
                userDetails={userDetails.data}
                isMuted={isMuted}
                setIsMuted={setIsMuted}
              />
            )
          ))
        ))}
      </div>
    </div>
  );
};

export default Pulse;
