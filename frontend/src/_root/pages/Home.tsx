import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import { Button } from "@/components/ui/button";
import React from "react";

function Home() {
  const postsDetails = [
    {
      id:1,
      creator: {
        id :1,
        name:"user1"
      },
      tags:["tag1", "tag2"],
      location:"india",
      caption:"hey there it's my post"
    },
    {
      id:2,
      creator: {
        id :2,
        name:"user2"
      },
      tags:["tag1", "tag2"],
      location:"india",
      caption:"hey there it's my post"
    },
    {
      id:3,
      creator: {
        id :3,
        name:"user3"
      },
      tags:["tag1", "tag2"],
      location:"india",
      caption:"hey there it's my post"
    },
  ]
  const userDetails = [
    {
      id: 1,
      name: "User1",
      username: "username1",
    },
    {
      id: 2,
      name: "User2",
      username: "username2",
    },
    {
      id: 3,
      name: "User3",
      username: "username3",
    },
    {
      id: 4,
      name: "User4",
      username: "username4",
    },
    {
      id: 5,
      name: "User5",
      username: "username5",
    },
  ];
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {postsDetails?.map((post) => (
                <li key={post.id} className="flex justify-center w-full">
                  <PostCard post={post} user={userDetails[post.id-1]}/>
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
