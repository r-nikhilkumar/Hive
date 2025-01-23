import { Models } from "appwrite";
import { useState } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked, dateFormated } from "@/lib/utils";
import Overlay from "./Overlay";
import { useToggleLikeMutation } from "@/redux/api/postApi";

const PostStats = ({ post, userDetails }) => {
  const location = useLocation();
  const [toggleLike] = useToggleLikeMutation();
  const isLiked = post.likes.likes.some((like) => like.userId === userDetails._id);
  const likesCount = post.likesCount;
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  const handleLikePost = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();
    toggleLike({ postId: post._id, userId:userDetails._id });
  };

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();
  };

  const handleCommentClick = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setOverlayVisible(true);
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
            isLiked
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likesCount}</p>
        <img
          src="/assets/icons/comment.svg"
          alt="comment"
          width={20}
          height={20}
          onClick={(e) => handleCommentClick(e)}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{post.commentsCount}</p>
        <img
          src="/assets/icons/share.svg"
          alt="share"
          width={20}
          height={20}
          onClick={(e) => {}}
          className="cursor-pointer"
        />
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
        <div className="p-4 bg-dark-3 boder border-2 border-dark-4 rounded">
          <h2 className="text-lg font-semibold mb-4">Comments</h2>
          <div className="overflow-y-auto max-h-96 custom-scrollbar">
          {post.comments.comments.map((comment) => (
            <div key={comment?._id} className="mb-4 flex items-start">
              <img
                src={comment?.user?.profilePic || "/assets/icons/profile-placeholder.svg"}
                alt="user"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="text-sm font-semibold">{comment?.user?.username}</p>
                <p className="text-sm">{comment?.comment}</p>
                <p className="text-xs text-gray-500">{dateFormated(comment?.date)}</p>
              </div>
            </div>
          ))}
          </div>
        </div>
      </Overlay>
    </div>
  );
};

export default PostStats;
