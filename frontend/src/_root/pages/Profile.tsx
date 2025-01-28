import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";

import { Button } from "@/components/ui";
import { GridPostList } from "@/components/shared";
import { useGetUserByIdQuery } from "@/redux/api/userApi";
import { useSelector } from "react-redux";
import { useGetPostByUserIdQuery } from "@/redux/api/postApi";
import { HashLoader } from "react-spinners";

interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  console.log(id)
  const pathname = useLocation().pathname;
  const {data: profile, isLoading:isProfileFetching} = useGetUserByIdQuery(id, {skip: pathname !== `/u/${id}`})
  const userId = useSelector((state: any) => state.auth.userId);
  const { data: userDetails, isLoading: isUserDetailsLoading } =
    useGetUserByIdQuery(userId, { skip: !userId });
  const {data: Post, isLoading:isPostLoading} = useGetPostByUserIdQuery(id, {skip: pathname !== `/u/${id}`})

  if (isProfileFetching || isUserDetailsLoading || isPostLoading)
    return (
      <div className="flex-center w-full h-screen items-center justify-center">
        <HashLoader color="#F87171" size={40} />
      </div>
    );


  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              profile.data.profilePic || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {profile.data.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{profile.data.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={Post.data.length} label="Posts" />
              <StatBlock value={20} label="Followers" />
              <StatBlock value={20} label="Following" />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {profile.data.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${profile.data._id !== userDetails.data._id && "hidden"}`}>
              <Link
                to={`/update-profile/${profile.data._id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  profile.data._id !== userDetails.data._id && "hidden"
                }`}>
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${userDetails.data._id === id && "hidden"}`}>
              <Button type="button" className="shad-button_primary px-8">
                Follow
              </Button>
            </div>
          </div>
        </div>
      </div>

      {profile.data._id !== userDetails.data._id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/u/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}>
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          {/* <Link
            to={`/u/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}>
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link> */}
        </div>
      )}

      <Routes>
        <Route
          index
          element={<GridPostList posts={Post.data} user={profile.data} showUser={false} />}
        />
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
