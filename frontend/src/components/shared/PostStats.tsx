import { Models } from "appwrite";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";
import Overlay from "./Overlay";

const PostStats = ({ post, userId }: PostStatsProps) => {
  const location = useLocation();
  const [liked, setLiked] = useState(false)
  const [numberLikes, setNumberLikes] = useState(500)
  const [isOverlayVisible, setOverlayVisible] = useState(true)
  

  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setLiked(!liked)
    setNumberLikes(numberLikes+(!liked?1:-1))
  };

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            liked
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{numberLikes}</p>
        <img
          src="/assets/icons/comment.svg"
          alt="comment"
          width={20}
          height={20}
          onClick={(e) => {
            console.log("here")
            setOverlayVisible(true)}}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{0}</p>
        <img
          src="/assets/icons/share.svg"
          alt="share"
          width={20}
          height={20}
          onClick={(e) => {}}
          className="cursor-pointer"
        />
        {/* <p className="small-medium lg:base-medium">{0}</p> */}
      </div>

      <div className="flex gap-2">
        <img
          src={false ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={(e) => handleSavePost(e)}
        />
      </div>
      <Overlay isVisible={isOverlayVisible} onClose={() => setOverlayVisible(false)}>
        <p>This is customizable overlay content!</p>
      </Overlay>
    </div>
  );
};

export default PostStats;
