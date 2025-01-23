import { useEffect, useMemo, useState } from "react";
import ProfileViewLinear from "../ProfileViewLinear";
import { Input } from "@/components/ui";
import { initializeChatRoom } from "@/redux/api/socket";
import Loader from "../Loader";
import { useDeleteChatRoomMutation, useGetChatRoomsQuery } from "@/redux/api/chatApi"; // Import the deleteChatRoom function
import OverlayScreen from "./OverlayScreen"; // Import the OverlayScreen component
import deleteIcon from "/assets/icons/delete.svg"; // Import the delete icon

function ChatSidebar() {
  const [searchValue, setSearchValue] = useState("");
  const [isOverlayOpen, setIsOverlayOpen] = useState(false); // State to manage overlay visibility

  // Fetch chat rooms
  const {
    data: chatRooms,
    isLoading,
    isSuccess,
    isError,
  } = useGetChatRoomsQuery(undefined);

  const [ deleteChatRoom ] = useDeleteChatRoomMutation(); // Import the deleteChatRoom mutation

  // Initialize chat rooms on successful fetch
  useEffect(() => {
    if (isSuccess && chatRooms?.data.length > 0) {
      chatRooms.data.forEach((chatRoom:any) => {
        initializeChatRoom(chatRoom._id);
      });
    }
  }, [isSuccess, chatRooms]);

  // Filter chat rooms based on search input
  const filteredChatRooms = useMemo(() => {
    return chatRooms?.data.filter((chatRoom:any) =>
      chatRoom.roomName.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, chatRooms]);

  // Function to handle chat room deletion
  const handleDeleteChatRoom = (chatRoomId:any) => {
    try {
      deleteChatRoom(chatRoomId)
    } catch (error) {
      console.error("Error deleting chat room: ", error);
    }
  };

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

      <div className="floating-button" onClick={() => setIsOverlayOpen(true)}>
        Add New Chats
      </div>

      <div className="chatRoomContainer">
        {/* Render chat rooms or loader/error */}
        {isLoading && <Loader />}
        {isError && <div>Error loading chat rooms</div>}
        {isSuccess && filteredChatRooms.length > 0 ? (
          filteredChatRooms.map((chatRoom:any) => (
            <div key={chatRoom._id} className="flex items-center gap-2">
              <ProfileViewLinear chatRoom={chatRoom} />
              <img
                src={deleteIcon}
                alt="Delete"
                className="cursor-pointer"
                onClick={() => handleDeleteChatRoom(chatRoom._id)}
              />
            </div>
          ))
        ) : (
          <div className="text-center">No chat rooms available</div>
        )}
      </div>

      {/* Overlay Screen */}
      {isOverlayOpen && (
        <OverlayScreen onClose={() => setIsOverlayOpen(false)} />
      )}
    </div>
  );
}

export default ChatSidebar;
