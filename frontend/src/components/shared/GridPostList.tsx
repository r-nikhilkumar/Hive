// import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { PostStats } from "@/components/shared";
// import { useUserContext } from "@/context/AuthContext";

const GridPostList = ({
  posts,
  user,
  showUser = true,
  showStats = true,
}: any) => {
  // const { user } = useUserContext();

  return (
    <ul className="grid-container">
      {posts.map((post: any) => (
        <li key={post._id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post._id}`} className="grid-post_link">
            {post.content[0].endsWith(".mp4") ? (
              <video controls className="post-card_media" autoPlay loop muted>
                <source src={post.content[0]} type="video/mp4"/>
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={post.content[0]}
                alt={`post media`}
                className="post-card_media"
              />
            )}
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={
                    post.user.profilePic ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1">{post.user.name}</p>
              </div>
            )}
            {user._id && <PostStats post={post} userId={user._id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;
