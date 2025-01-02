import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiPaperclip, FiMic, FiMicOff } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import MessageCard from "../MessageCard";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

function ChatScreen() {
  const { id } = useParams();
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioMessages, setAudioMessages] = useState<string[]>([]);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatAreaRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    console.log(selectedFiles);
  };

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [isTyping, audioMessages]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTyping(e.target.value.trim() !== "");
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
    setAudioMessages((prev) => [...prev, url])
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

  const messages = [
    {
      id: 1,
      message: "Hey! How's it going?",
      messageType: "text",
      type: "message-left",
      timestamp: "10:30 AM",
      status: "",
      profilePic: "/assets/icons/profile-placeholder.svg",
    },
    {
      id: 2,
      message: "All good! What about you?",
      messageType: "text",
      type: "message-right",
      timestamp: "10:31 AM",
      status: "Read",
      profilePic: "/assets/icons/profile-placeholder.svg",
    },
    {
      id: 3,
      message: "All good! What about you?",
      messageType: "text",
      type: "message-right",
      timestamp: "10:31 AM",
      status: "Read",
      profilePic: "/assets/icons/profile-placeholder.svg",
    },
    {
      id: 4,
      message: "/assets/images/post_placeholder.png",
      messageType: "photo",
      type: "message-left",
      timestamp: "10:32 AM",
      status: "",
      profilePic: "/assets/icons/profile-placeholder.svg",
    },
    {
      id: 5,
      message: "/assets/videos/sample-video.mp4",
      messageType: "video",
      type: "message-right",
      timestamp: "10:33 AM",
      status: "Delivered",
      profilePic: "/assets/icons/profile-placeholder.svg",
    },
    {
      id: 6,
      message: "/assets/audios/sample-voice.mp3",
      messageType: "voice",
      type: "message-right",
      timestamp: "10:34 AM",
      status: "Sent",
      profilePic: "/assets/icons/profile-placeholder.svg",
    },
    ...audioMessages.map((audioURL, index) => ({
      id: 7 + index,
      message: audioURL,
      messageType: "voice",
      type: "message-right",
      timestamp: new Date().toLocaleTimeString(),
      status: "Sent",
      profilePic: "/assets/icons/profile-placeholder.svg",
    })),
  ];

  return (
    <div className="chat-screen">
      <div className="chat-header">
        <img
          src="/assets/icons/profile-placeholder.svg"
          alt="User Avatar"
          className="chat-header_avatar"
        />
        <div className="chat-header_info">
          <h2 className="chat-header_name">{id}</h2>
          <p className="chat-header_status">Online</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area" ref={chatAreaRef}>
        <div className="chat-messages">
          {messages.map((msg) => (
            <MessageCard key={msg.id} {...msg} />
          ))}
        </div>
        {isTyping && (
          <div className="chat-typing">
            <div className="chat-typing_dot"></div>
            <div className="chat-typing_dot delay-100"></div>
            <div className="chat-typing_dot delay-200"></div>
          </div>
        )}
      </div>

      {/* Typing Input */}
      <div className="chat-input">
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
        { (!recorderControls.isRecording || !isMobile) && <input
          type="text"
          placeholder="Type a message..."
          className="chat-input_field"
          onChange={handleTyping}
        />}
        {/* <button
          className="chat-input_icon"
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? (
            <FiMicOff size={24} color="red" />
          ) : (
            <FiMic size={24} />
          )}
        </button>
        {isRecording && (
          <div className="recording-animation">
            <div className="recording-dot"></div>
            <p>Recording...</p>
          </div>
        )} */}
        <AudioRecorder
          onRecordingComplete={(blob) => addAudioElement(blob)}
          recorderControls={recorderControls}
        />
        {(!recorderControls.isRecording || !isMobile) && <button className="chat-input_send">Send</button>}
      </div>
    </div>
  );
}

export default ChatScreen;
