import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiPaperclip, FiMic, FiMicOff } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import MessageCard from "../MessageCard";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import {
  joinRoom,
  leaveRoom,
  receivePreviousMessages,
  sendMessage,
  receiveMessage,
  receiveMessageReceived,
  deleteMessage,
  receiveMessageDeleted,
} from "@/redux/api/socket";
import { useSelector } from "react-redux";
import {
  useGetChatRoomsQuery,
} from "@/redux/api/chatApi";
import { useUploadFilesMutation } from "@/redux/api/commonApi";
import { Message } from "@/types"; // Import the Message type

function ChatScreen() {
  const { id: chatRoomId } = useParams();
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioMessages, setAudioMessages] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatAreaRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const currentUserId = useSelector((state) => state.auth.userId);
  const { data: chatRooms, isSuccess } = useGetChatRoomsQuery();
  const chatRoom = isSuccess
    ? chatRooms.data.find((room) => room._id === chatRoomId)
    : null;
  const [uploadFiles] = useUploadFilesMutation();

  const cacheMessages = (chatRoomId, messages) => {
    localStorage.setItem(`chat_${chatRoomId}`, JSON.stringify(messages));
  };

  const getCachedMessages = (chatRoomId) => {
    const cached = localStorage.getItem(`chat_${chatRoomId}`);
    return cached ? JSON.parse(cached) : null;
  };

  useEffect(() => {
    joinRoom(chatRoomId);
    receivePreviousMessages((messages) => {
      setMessages(messages);
      cacheMessages(chatRoomId, messages);
    });
    receiveMessage((message) => {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, message];
        cacheMessages(chatRoomId, updatedMessages);
        return updatedMessages;
      });
    });
    receiveMessageReceived((message) => {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, message];
        cacheMessages(chatRoomId, updatedMessages);
        return updatedMessages;
      });
    });

    receiveMessageDeleted(({ messageId }) => {
      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.filter(
          (msg) => msg._id !== messageId
        );
        cacheMessages(chatRoomId, updatedMessages);
        return updatedMessages;
      });
    });

    return () => {
      leaveRoom(chatRoomId);
      setMessages([]);
    };
  }, [chatRoomId, receiveMessageDeleted]);

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const formData = new FormData();
      Array.from(selectedFiles).forEach((file) => {
        formData.append("files", file);
      });

      const tempMessageId = `temp-${Date.now()}`;
      const tempAttachments = Array.from(selectedFiles).map((file) => ({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
      }));

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          _id: tempMessageId,
          userId: currentUserId,
          message: "",
          attachments: tempAttachments,
          status: "uploading",
          timestamp: Date.now(),
          user: {
            _id: currentUserId,
            name: "You",
            profilePic: "", // Add current user's profile pic if available
          },
        },
      ]);

      try {
        const response = await uploadFiles(formData).unwrap();
        console.log("Uploaded files:", response);

        const attachments = response.data.map((file) => ({
          name: file.name,
          type: file.type,
          url: file.url,
        }));

        console.log("Attachments:", attachments);

        sendMessage(chatRoomId, newMessage, attachments);
        setNewMessage("");
        setIsTyping(false);

        // Remove the temporary message
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== tempMessageId)
        );
      } catch (error) {
        console.error("Error uploading files:", error);
      }
    }
  };

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [isTyping, audioMessages, messages]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTyping(e.target.value.trim() !== "");
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      console.log("Sending message:", newMessage);
      sendMessage(chatRoomId, newMessage);
      setNewMessage("");
      setIsTyping(false);
    }
  };

  const handleDeleteMessage = (messageId) => {
    deleteMessage(messageId);
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.filter(
        (msg) => msg._id !== messageId
      );
      cacheMessages(chatRoomId, updatedMessages);
      return updatedMessages;
    });
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 468);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 468);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const recorderControls = useAudioRecorder();
  const addAudioElement = async (blob) => {
    const formData = new FormData();
    formData.append("files", blob, "audioMessage.mp3");
    console.log(blob);

    const tempMessageId = `temp-${Date.now()}`;
    const tempAttachment = {
      name: "audioMessage.mp3",
      type: "audio/mpeg",
      url: URL.createObjectURL(blob),
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        _id: tempMessageId,
        userId: currentUserId,
        message: "",
        attachments: [tempAttachment],
        status: "uploading",
        timestamp: Date.now(),
        user: {
          _id: currentUserId,
          name: "You",
          profilePic: "", // Add current user's profile pic if available
        },
      },
    ]);

    try {
      const response = await uploadFiles(formData).unwrap();
      // console.log("Uploaded audio:", response);
      const audioAttachment = response.data[0];
      console.log("Audio attachment:", audioAttachment);

      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== tempMessageId)
      );

      sendMessage(chatRoomId, "", [
        {
          name: audioAttachment.name,
          type: audioAttachment.type,
          url: audioAttachment.url,
        },
      ]);
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mpeg",
        });
        addAudioElement(audioBlob);
        audioChunksRef.current = [];
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isMobile) {
      if (e.key === "Enter" && !e.shiftKey) {
        return;
      }
    } else {
      if (e.key === "Enter" && newMessage.trim() !== "" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    }
  };

  return (
    <div className="chat-screen">
      <div className="chat-header">
        {chatRoom && (
          <>
            <img
              src={
                chatRoom.roomAvatar || "/assets/icons/profile-placeholder.svg"
              }
              alt="User Avatar"
              className="chat-header_avatar"
            />
            <div className="chat-header_info">
              <h2 className="chat-header_name">{chatRoom.roomName}</h2>
              <p className="chat-header_status">Online</p>
            </div>
          </>
        )}
      </div>

      <div className="chat-area" ref={chatAreaRef}>
        <div className="chat-messages">
          {messages?.map((msg) => {
            // console.log("Message:", msg);
            const messageType = msg.attachments.length
              ? msg.attachments[0].type.startsWith("image/")
                ? "photo"
                : msg.attachments[0].type.startsWith("video/")
                ? "video"
                : msg.attachments[0].type.startsWith("audio/")
                ? "voice"
                : "attachment"
              : "text";
            return (
              <MessageCard
                key={msg._id}
                message={
                  msg.attachments?.length ? msg.attachments : msg.message
                }
                messageType={messageType}
                type={
                  msg.userId === currentUserId
                    ? "message-right"
                    : "message-left"
                }
                timestamp={msg.timestamp}
                status={msg.status}
                profilePic={msg.user.profilePic}
                onDelete={() => handleDeleteMessage(msg._id)}
                name={msg.user.name}
                email={msg.user.email}
                username={msg.user.username}
                bio={msg.user.bio}
                isUploading={msg.status === "uploading"}
              />
            );
          })}
        </div>
      </div>

      <div className="chat-input">
        {isTyping && (
          <div className="chat-typing">
            <div className="chat-typing_dot"></div>
            <div className="chat-typing_dot delay-100"></div>
            <div className="chat-typing_dot delay-200"></div>
          </div>
        )}
        <button className="chat-input_icon">
          <BsEmojiSmile size={30} />
        </button>
        <button className="chat-input_icon" onClick={handleFileClick}>
          <FiPaperclip size={24} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,audio/*"
          multiple
          onChange={handleFileChange}
          style={{ display: "none" }}
          onKeyDown={handleKeyDown}
        />
        {(!recorderControls.isRecording || !isMobile) && (
          <input
            type="text"
            placeholder="Type a message..."
            className="chat-input_field"
            value={newMessage}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
          />
        )}
        <AudioRecorder
          onRecordingComplete={(blob) => addAudioElement(blob)}
          recorderControls={recorderControls}
        />
        {(!recorderControls.isRecording || !isMobile) && (
          <button className="chat-input_send" onClick={handleSendMessage}>
            Send
          </button>
        )}
      </div>
    </div>
  );
}

export default ChatScreen;
