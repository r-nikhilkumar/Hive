import React, { useEffect, useState } from "react";
import ProfileViewLinear from "../ProfileViewLinear";
import { Input } from "@/components/ui";
import { useGetChatRoomsQuery, initializeChatRoom } from "@/redux/api/chatApi";
import Loader from "../Loader";

function ChatSidebar() {
  const [searchValue, setSearchValue] = useState("");

  // Correctly call the useGetChatRoomsQuery hook
  const { data: chatRooms, error, isLoading, isSuccess, isError } = useGetChatRoomsQuery(null);

  useEffect(() => {
    if (isSuccess && chatRooms?.data.length > 0) {
      chatRooms.data.forEach(chatRoom => {
        initializeChatRoom(chatRoom._id);
      });
    }
  }, [isSuccess, chatRooms]);

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
      {isLoading && <Loader/>}
      {isError && <div>Error loading chat rooms</div>}
      {isSuccess && chatRooms?.data.length > 0 ? (
        chatRooms.data.map((chatRoom) => (
          <ProfileViewLinear key={chatRoom._id} user={chatRoom} />
        ))
      ) : (
        <div className="text-center">No chat rooms available</div>
      )}
    </div>
  );
}

export default ChatSidebar;
