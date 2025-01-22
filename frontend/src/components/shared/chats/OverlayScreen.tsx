import React, { useState } from "react";
import { Button, Input } from "@/components/ui";
import { useGetUsersQuery } from "@/redux/api/userApi";
import { useUploadFilesMutation } from "@/redux/api/commonApi";
import { useCreateChatRoomMutation } from "@/redux/api/chatApi";


function OverlayScreen({ onClose }) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupPic, setGroupPic] = useState(null);
  const [fileName, setFileName] = useState("");

  const { data: users, isLoading, isError } = useGetUsersQuery();
  const [createChatRoom] = useCreateChatRoomMutation();
  const [uploadFiles] = useUploadFilesMutation();

  const handleUserSelect = (userId) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter((id) => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };

  const handleGroupPicChange = (e) => {
    const file = e.target.files[0];
    setGroupPic(file);
    setFileName(file ? file.name : "");
  };

  const handleCreateChat = async () => {
    let groupPicUrl = null;

    if (groupPic) {
      const formData = new FormData();
      formData.append("files", groupPic);

      try {
        const response = await uploadFiles(formData).unwrap();
        groupPicUrl = response.data[0].url;
      } catch (error) {
        console.error("Error uploading group picture: ", error);
        return;
      }
    }
    let payload;
    if (selectedUsers.length === 1) {
       payload = { participants: selectedUsers, type: "personal" };
    //   console.log(payload);
    } else if (selectedUsers.length > 1) {
      payload = {
        participants: selectedUsers,
        type: "group",
        roomName: groupName,
        roomAvatar: groupPicUrl,
      };
    }
    if (!payload) {
      return;
    }
    await createChatRoom(payload).unwrap();
    onClose();
  };

  return (
    <div className="overlay-screen">
      <div className="overlay-content">
        <button
          onClick={onClose}
          className="close-button"
        >
          ✕
        </button>
        <div className="flex flex-col items-center h-full">
          <h2>Select Users</h2>
          {isLoading && <div>Loading users...</div>}
          {isError && <div>Error loading users</div>}
          <div className="scrollbar-thin">
            {users &&
              users.data.map((user) => (
                <div
                  key={user._id}
                  className="user-item hover:bg-gray-800"
                >
                  <img
                    src={
                      user.profileImage ||
                      "/assets/icons/profile-placeholder.svg"
                    }
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="ml-3">{user.name}</span>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleUserSelect(user._id)}
                    className="ml-auto"
                  />
                </div>
              ))}
          </div>
          {selectedUsers.length > 1 && (
            <>
              <Input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="explore-search mt-1 mb-1"
              />
              <label htmlFor="file-upload" className="file-upload-label">
                <span>{fileName || "Choose File"}</span>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleGroupPicChange}
                  className="hidden-input mb-1 mt-1"
                />
              </label>
            </>
          )}
          <Button onClick={handleCreateChat} className="shad-button_primary space-y-3 mt-3 w-full">
            Create Chat
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OverlayScreen;
