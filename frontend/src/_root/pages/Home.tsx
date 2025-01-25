import PostCard from "@/components/shared/PostCard";
import PostSkeleton from "@/components/skeletons/PostSkeleton";
import { useGetPostsQuery } from "@/redux/api/postApi";
import { useGetUserByIdQuery } from "@/redux/api/userApi";
import { useSelector } from "react-redux";

function Home() {
  const { data: postsDetails, isLoading } = useGetPostsQuery(null);
  const userId = useSelector((state: any) => state.auth.userId);
  const { data: userDetails, isFetching: isUserDetailsLoading } =
    useGetUserByIdQuery(userId, { skip: !userId });
  if (isLoading || isUserDetailsLoading)
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <div className="home-posts">
            {Array.from({ length: 5 }).map((_, index) => (
              <PostSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  return (
    <div className="home-container">
      <div className="flex flex-1">
        <div className="home-posts">
          {/* <ul className="flex flex-col gap-9"> */}
          {postsDetails?.data?.map((post: any) => (
            // <li key={post._id} className="flex justify-center">
            <PostCard
              post={post}
              user={post.user}
              userDetails={userDetails?.data}
            />
            // </li>
          ))}
          {/* </ul> */}
        </div>
      </div>
      {/* <div className="home-creators">
        <h3 className="h3-bold text-light-1 flex justify-center">Top Creators</h3>
        <ul className="grid 2xl:grid-cols-2 gap-6">
          {userDetails.map((creator) => (
            <li key={creator.id}>
              <UserCard user={creator} />
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}

export default Home;
