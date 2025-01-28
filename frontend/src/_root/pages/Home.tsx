import { UserCard } from "@/components/shared";
import PostCard from "@/components/shared/PostCard";
import PostSkeleton from "@/components/skeletons/PostSkeleton";
import UserSkeleton from "@/components/skeletons/UserSkeleton";
import { useGetPostsQuery } from "@/redux/api/postApi";
import { useGetUserByIdQuery, useGetUsersQuery } from "@/redux/api/userApi";
import { useSelector } from "react-redux";

function Home() {
  const { data: postsDetails, isLoading } = useGetPostsQuery(null);
  const userId = useSelector((state: any) => state.auth.userId);
  const { data: userDetails, isLoading: isUserDetailsLoading } =
    useGetUserByIdQuery(userId, { skip: !userId });
  const { data: allUsers, isLoading: isAllUsers } = useGetUsersQuery(undefined);
  if (isLoading || isUserDetailsLoading || isAllUsers)
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <div className="home-posts">
            {Array.from({ length: 5 }).map((_, index) => (
              <PostSkeleton key={index} />
            ))}
          </div>
        </div>
        <div className="home-creators overflow-y-scoll custom-scrollbar">
          <h3 className="h3-bold text-light-1 flex justify-center">
            Top Creators
          </h3>
          <ul className="grid 2xl:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <UserSkeleton key={index} />
            ))}
          </ul>
        </div>
      </div>
    );
  return (
    <div className="flex justify-between w-full">
      <div className="home-container">
        <div className="flex flex-1 justify-between">
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
      </div>
      <div className="home-creators overflow-y-scoll custom-scrollbar">
        <h3 className="h3-bold text-light-1 flex justify-center">
          Top Creators
        </h3>
        <ul className="grid 2xl:grid-cols-2 gap-3">
          {allUsers?.data?.map((user: any) => (
            <li key={user._id}>
              <UserCard user={user} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
