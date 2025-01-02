import React, { useState } from "react";
import ProfileViewLinear from "../ProfileViewLinear";
import { Input } from "@/components/ui";

function ChatSidebar() {
  const [searchValue, setSearchValue] = useState("");

  const users = [
    {
      id: 1,
      name: "John Doe",
      imageUrl: "https://example.com/john-doe.jpg",
    },
    {
      id: 2,
      name: "Jane Doe",
      imageUrl: "https://example.com/jane-doe.jpg",
    },
    {
      id: 3,
      name: "Alice Smith",
      imageUrl: "https://example.com/alice-smith.jpg",
    },
    {
      id: 4,
      name: "Bob Johnson",
      imageUrl: "https://example.com/bob-johnson.jpg",
    },
    {
      id: 5,
      name: "Emily Davis",
      imageUrl: "https://example.com/emily-davis.jpg",
    },
    {
      id: 6,
      name: "Michael Brown",
      imageUrl: "https://example.com/michael-brown.jpg",
    },
    {
      id: 7,
      name: "Sarah Wilson",
      imageUrl: "https://example.com/sarah-wilson.jpg",
    },
    {
      id: 8,
      name: "David Taylor",
      imageUrl: "https://example.com/david-taylor.jpg",
    },
    {
      id: 9,
      name: "Sophia Martinez",
      imageUrl: "https://example.com/sophia-martinez.jpg",
    },
    {
      id: 10,
      name: "James Anderson",
      imageUrl: "https://example.com/james-anderson.jpg",
    },
    {
      id: 11,
      name: "David Taylor",
      imageUrl: "https://example.com/david-taylor.jpg",
    },
    {
      id: 12,
      name: "Sophia Martinez",
      imageUrl: "https://example.com/sophia-martinez.jpg",
    },
    {
      id: 13,
      name: "James Anderson",
      imageUrl: "https://example.com/james-anderson.jpg",
    },
  ];

  return (
    <div className="chatsidebar">
      <div className="flex gap-1 px-4 w-full rounded-full bg-dark-3 mb-3">
        <img
          src="/assets/icons/search.svg"
          width={24}
          height={24}
          alt="search"
        />
        <Input
          type="text"
          placeholder="Search"
          className="explore-search"
          value={searchValue}
          onChange={(e) => {
            const { value } = e.target;
            setSearchValue(value);
          }}
        />
      </div>
      {users.map((user, index) => (
        <ProfileViewLinear key={user.id} user={user} />
      ))}
    </div>
  );
}

export default ChatSidebar;
