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
  cacheMessages,
  getCachedMessages,
} from "@/redux/api/chatApi";
import { useSelector } from "react-redux";

function ChatScreen() {
  const { id: chatRoomId } = useParams();
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioMessages, setAudioMessages] = useState<string[]>([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatAreaRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const currentUserId = useSelector((state)=> state.auth.userId)

  useEffect(() => {
    // const cachedMessages = getCachedMessages(chatRoomId);
    // if (cachedMessages) {
    //   setMessages(cachedMessages);
    // } else {
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
      console.log("Message received:", message);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, message];
        cacheMessages(chatRoomId, updatedMessages);
        return updatedMessages;
      });
    });
    // }

    return () => {
      leaveRoom(chatRoomId);
      setMessages([]); // Clear messages when leaving the room
    };
  }, [chatRoomId]);

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const attachments = Array.from(selectedFiles).map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
      }));
      sendMessage(chatRoomId, newMessage, attachments);
      setNewMessage("");
      setIsTyping(false);
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
      sendMessage(chatRoomId, newMessage);
      setNewMessage("");
      setIsTyping(false);
    }
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Listen for window resize changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const recorderControls = useAudioRecorder();
  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    setAudioMessages((prev) => [...prev, url]);
    sendMessage(chatRoomId, "", [{ name: "audio", type: "audio/mpeg", url }]);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mpeg",
        });
        const audioURL = URL.createObjectURL(audioBlob);
        setAudioMessages((prev) => [...prev, audioURL]);
        setRecordedAudio(audioBlob);
        sendMessage(chatRoomId, "", [
          { name: "audio", type: "audio/mpeg", url: audioURL },
        ]);
        audioChunksRef.current = []; // Clear chunks for the next recording
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

  return (
    <div className="chat-screen">
      <div className="chat-header">
        <img
          src="/assets/icons/profile-placeholder.svg"
          alt="User Avatar"
          className="chat-header_avatar"
        />
        <div className="chat-header_info">
          <h2 className="chat-header_name">{chatRoomId}</h2>
          <p className="chat-header_status">Online</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area" ref={chatAreaRef}>
        <div className="chat-messages">
          {messages?.map((msg) => {
            console.log(msg);
            return (
              <MessageCard
                key={msg._id}
                message={msg.message}
                messageType={msg.attachments.length ? "photo" : "text"} // Change this logic as per your message type
                type={
                  msg.userId === currentUserId
                    ? "message-right"
                    : "message-left"
                }
                timestamp={msg.timestamp}
                status={msg.status}
                profilePic={undefined}
              />
            );
          })}
        </div>
      </div>

      {/* Typing Input */}
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
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        {(!recorderControls.isRecording || !isMobile) && (
          <input
            type="text"
            placeholder="Type a message..."
            className="chat-input_field"
            value={newMessage}
            onChange={handleTyping}
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
