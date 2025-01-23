import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

export const PulseVideo = ({ src }:{src:any}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [liked, setLiked] = useState(false);
  const [numberLikes, setNumberLikes] = useState(500);
  const { ref, inView } = useInView({
    threshold: 0.5, // Video plays when 50% visible
  });

  useEffect(() => {
    if (inView) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [inView]);

  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setLiked(!liked);
    setNumberLikes(numberLikes + (!liked ? 1 : -1));
  };

  return (
    <div
      ref={ref}
      className="relative w-full h-screen flex justify-center items-center bg-black snap-center"
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-auto max-w-[360px] md:max-w-[500px] object-cover rounded-md"
        muted
        loop
        playsInline
      />

      {/* Bottom Overlay Content */}
      <div className="absolute bottom-16 left-4 md:bottom-10 md:left-6 w-[80%] text-white text-sm md:text-base">
        <p className="font-medium">Hi, this is your video description or username!</p>
      </div>

      {/* Overlay Actions */}
      <div className="absolute bottom-16 right-4 flex flex-col items-center space-y-4 md:space-y-6">
        {/* Like Button */}
        <div className="flex flex-col items-center">
          <img
            src={`${
              liked ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"
            }`}
            alt="like"
            width={25}
            height={25}
            onClick={(e) => handleLikePost(e)}
            className="cursor-pointer hover:scale-110 transition-transform"
          />
          <p className="text-white text-xs md:text-sm">{numberLikes}</p>
        </div>
        {/* Comment Button */}
        <div className="flex flex-col items-center">
          <img
            src="/assets/icons/comment.svg"
            alt="comment"
            width={25}
            height={25}
            className="cursor-pointer hover:scale-110 transition-transform"
          />
          <p className="text-white text-xs md:text-sm">{0}</p>
        </div>
        {/* Share Button */}
        <div className="flex flex-col items-center">
          <img
            src="/assets/icons/share.svg"
            alt="share"
            width={25}
            height={25}
            className="cursor-pointer hover:scale-110 transition-transform"
          />
        </div>
      </div>
    </div>
  );
};
