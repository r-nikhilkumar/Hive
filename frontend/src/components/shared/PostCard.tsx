import { Link } from "react-router-dom";
import { dateFormated } from "@/lib/utils";
import PostStats from "./PostStats";
import { Button, Input } from "@/components/ui";
import { useState } from "react";
import SendMessage from "./SendMessage";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useToggleCommentMutation } from "@/redux/api/postApi";

const PostCard = ({ post, user, userDetails }) => {
  // console.log("user", userDetails);
  if (!post.user) return;
  const [text, setText] = useState("");
  const [toggleComment] = useToggleCommentMutation();

  function handleOnEnter(text) {
    setText("");
    toggleComment({ postId: post._id, comment:{ comment:text }, userDetails });
  }

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/u/${user._id}`}>
            <img
              src={user.profilePic || "/assets/icons/profile-placeholder.svg"}
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">{user.name}</p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {dateFormated(post.date)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 items-center">
          <Link
            to={`/update-post/${post._id}`}
            className={`${user._id !== userDetails?._id && "hidden"}`}
          >
            <img
              src={"/assets/icons/edit.svg"}
              alt="edit"
              width={20}
              height={20}
            />
          </Link>
          <Button onClick={() => {}}>
            <img
              src={"/assets/icons/more.svg"}
              alt="more"
              width={20}
              height={20}
            />
          </Button>
        </div>
      </div>

      <Link to={`/posts/${post._id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.description}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string, index: string) => (
              <Link
                to={`/posts?tags=${tag}`}
                key={`${tag}${index}`}
                className="text-light-3 small-regular"
              >
                #{tag}
              </Link>
            ))}
          </ul>
        </div>
      </Link>

      {post.content && post.content.length > 1 ? (
        <Carousel showThumbs={false}>
          {post.content.map((url, index) => (
            <div key={index} className="post-card_media-container">
              {url.endsWith(".mp4") ? (
                <video controls className="post-card_media">
                  <source src={url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={url}
                  alt={`post media ${index + 1}`}
                  className="post-card_media"
                />
              )}
            </div>
          ))}
        </Carousel>
      ) : (
        <div className="post-card_media-container">
          {post.content[0].endsWith(".mp4") ? (
            <video controls className="post-card_media">
              <source src={post.content[0]} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={post.content[0] || "/assets/images/post_placeholder.png"}
              alt="post media"
              className="post-card_media"
            />
          )}
        </div>
      )}

      {userDetails ? <>
        <PostStats post={post} userDetails={userDetails} />
        <div className="post-out-comment">
          <Link to={`/u/${user._id}`}>
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
        </div>
      </>
      : <div></div>}
    </div>
  );
};

export default PostCard;
