import { Loader } from "@/components/shared";
import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import { Button } from "@/components/ui/button";
import { useGetPostsQuery } from "@/redux/api/postApi";
import { useGetUserByIdQuery } from "@/redux/api/userApi";
import React, { useEffect, useId } from "react";
import { useSelector } from "react-redux";

function Home() {
  const {
    data: postsDetails,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsQuery();
  const userId = useSelector((state) => state.auth.userId);
  const { data: userDetails, isSuccess:isUserDetailsSuccess, isLoading: isUserDetailsLoading} = useGetUserByIdQuery(userId, {skip: !userId});

  if (isLoading || isUserDetailsLoading) return <div className="flex w-full justify-center items-center"><Loader/></div>;
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <ul className="flex flex-col flex-1 gap-9 w-full ">
            {postsDetails?.data?.map((post) => (
              <li key={post._id} className="flex justify-center w-full">
                <PostCard post={post} user={post.user} userDetails={userDetails?.data} />
              </li>
            ))}
          </ul>
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
