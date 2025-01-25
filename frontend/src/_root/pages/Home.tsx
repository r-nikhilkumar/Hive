import { Loader } from "@/components/shared";
import PostCard from "@/components/shared/PostCard";
import { useGetPostsQuery } from "@/redux/api/postApi";
import {
  useGetUserByIdQuery,
  // useGetUsersWithIdsMutation,
} from "@/redux/api/userApi";
// import { useEffect } from "react";
import { useSelector } from "react-redux";

function Home() {
  const { data: postsDetails, isLoading, isSuccess } = useGetPostsQuery(null);
  const userId = useSelector((state: any) => state.auth.userId);
  const { data: userDetails, isLoading: isUserDetailsLoading } =
    useGetUserByIdQuery(userId, { skip: !userId });
  // const [getUsers, { data: users, isLoading: isUsersLoading, isSuccess:isUserSuccess }] =
  //   useGetUsersWithIdsMutation();
  // const ids= [
  //   "6786a730585b1422bcdefd8f",
  //   "678790e99a9f5e1c95e324d7",
  //   "6790a8aecfe52b7dfa281984"
  // ];

  // useEffect(() => {
  //   // getUsers(ids);
  //   // if(isUserSuccess) console.log("users", users);
  //   if (isSuccess) {
  //     console.log("postsDetails", postsDetails);
  //     console.log("postsDetails", userDetails);
  //   } else {
  //     console.log("postsDetails", postsDetails);
  //   }
  // }, [postsDetails, userDetails]);

  if (isLoading || isUserDetailsLoading)
    return (
      <div className="flex w-full justify-center items-center">
        <Loader />
      </div>
    );
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <ul className="flex flex-col flex-1 gap-9 w-full ">
            {postsDetails?.data?.map((post: any) => (
              <li key={post._id} className="flex justify-center w-full">
                <PostCard
                  post={post}
                  user={post.user}
                  userDetails={userDetails?.data}
                />
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
