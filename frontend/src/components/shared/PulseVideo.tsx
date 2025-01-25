import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import PostStats from "./PostStats";
import SendMessage from "./SendMessage";
import { Link } from "react-router-dom";
import { useToggleCommentMutation } from "@/redux/api/postApi";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

export const PulseVideo = ({ src, video, userDetails, isMuted, setIsMuted }: { src: any; video: any; userDetails: any; isMuted: boolean; setIsMuted: (value: boolean) => void; }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [longPressTimeout, setLongPressTimeout] = useState<NodeJS.Timeout | null>(null);
  if (!video) return;
  const [text, setText] = useState("");
  const [toggleComment] = useToggleCommentMutation();

  function handleOnEnter(text: any) {
    if (text.trim() !== "") {
      setText("");
      toggleComment({
        postId: video._id,
        comment: { comment: text },
        userDetails,
      });
    }
  }
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [inView]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  const handleShowMoreToggle = () => {
    setShowMore((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowMore(false);
    };

    if (showMore) {
      window.addEventListener("click", handleClickOutside);
    } else {
      window.removeEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [showMore]);

  const handleTouchStart = () => {
    const timeout = setTimeout(() => {
      setIsOverlayVisible(false);
      videoRef.current?.pause();
    }, 500); // 500ms for long press
    setLongPressTimeout(timeout);
  };

  const handleTouchEnd = () => {
    if (longPressTimeout) {
      clearTimeout(longPressTimeout);
      setLongPressTimeout(null);
    }
    setIsOverlayVisible(true);
    videoRef.current?.play();
  };

  return (
    <div
      ref={ref}
      className="relative w-full h-screen flex justify-center items-center bg-dark-3 snap-center mt-5 mb-7"
      onClick={handleShowMoreToggle}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-screen max-w-[360px] md:max-w-[400px] object-cover rounded-md"
        muted={isMuted}
        loop
        playsInline
      />

      {/* Bottom Overlay Content */}
      {isOverlayVisible && (
        <div className="absolute bottom-20 md:bottom-4 w-[320px] md:w-[360px] text-white text-sm md:text-base p-4 rounded-md">
          <div
            className={`font-medium right-5 ${showMore ? "max-h-24 overflow-y-scroll no-scrollbar bg-black bg-opacity-40 " : "line-clamp-2"} overflow-hidden`}
          >
            {video?.description}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShowMoreToggle();
            }}
            className="mt-2 text-blue-400 hover:underline"
          >
            {showMore ? "See less" : "See more"}
          </button>
          <ul className="flex gap-1 mt-2">
            {video.tags.map((tag: string, index: string) => (
              <Link
                to={`/posts?tags=${tag}`}
                key={`${tag}${index}`}
                className="text-light-3 small-regular"
              >
                #{tag}
              </Link>
            ))}
          </ul>

          {userDetails ? (
            <>
              <PostStats post={video} userDetails={userDetails} />
              <div className="post-out-comment">
                <Link to={`/u/${userDetails._id}`}>
                  <img
                    src={
                      userDetails.profilePic ||
                      "/assets/icons/profile-placeholder.svg"
                    }
                    alt="user"
                    className="w-12 lg:h-12 rounded-full"
                  />
                </Link>
                <SendMessage
                  text={text}
                  setText={setText}
                  handleOnEnter={handleOnEnter}
                  placeholder={"comment..."}
                />
                <div
                  className="right-2 bottom-0 text-white cursor-pointer"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <FaVolumeMute size={20} />
                  ) : (
                    <FaVolumeUp size={20} />
                  )}
                </div>
              </div>
            </>
          ) : (
            <div></div>
          )}
        </div>
      )}
    </div>
  );
};
