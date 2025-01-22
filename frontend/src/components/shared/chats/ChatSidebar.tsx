import React, { useEffect, useMemo, useState } from "react";
import ProfileViewLinear from "../ProfileViewLinear";
import { Input } from "@/components/ui";
import { initializeChatRoom } from "@/redux/api/socket";
import Loader from "../Loader";
import { useGetChatRoomsQuery } from "@/redux/api/chatApi";

function ChatSidebar() {
  const [searchValue, setSearchValue] = useState("");

  // Correctly call the useGetChatRoomsQuery hook
  const { data: chatRooms, error, isLoading, isSuccess, isError } = useGetChatRoomsQuery();

  useEffect(() => {
    if (isSuccess && chatRooms?.data.length > 0) {
      chatRooms.data.forEach(chatRoom => {
        initializeChatRoom(chatRoom._id);
      });
    }
  }, [isSuccess, chatRooms]);

  const filteredChatRooms = useMemo(() => {
    return chatRooms?.data.filter(chatRoom =>
      chatRoom.roomName.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, chatRooms]);

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
      {isSuccess && filteredChatRooms.length > 0 ? (
        filteredChatRooms.map((chatRoom) => (
          <ProfileViewLinear key={chatRoom._id} chatRoom={chatRoom} />
        ))
      ) : (
        <div className="text-center">No chat rooms available</div>
      )}
    </div>
  );
}

export default ChatSidebar;
