import React, { useState, useEffect } from "react";
import SingleTick from "/assets/icons/single-tick.svg";
import DoubleGrayTick from "/assets/icons/double-tick.svg";
import DoubleBlueTick from "/assets/icons/double-tick-blue.svg";
import { formatDistanceToNow } from "date-fns"; // Import for time ago formatting
import { FiMoreVertical } from "react-icons/fi"; // Import for three-dot menu

const MessageCard = ({ message, messageType, type, timestamp, status, profilePic, onDelete, name, email, username, bio, isUploading }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(isUploading);

  useEffect(() => {
    if (!isUploading) {
      setLoading(false);
    }
  }, [isUploading]);

  // Format the timestamp to show time ago
  const timeAgo = timestamp ? formatDistanceToNow(new Date(Number(timestamp)), { addSuffix: true }) : "";

  const getStatusIcon = () => {
    if (status === "sent") return <img src={SingleTick} alt="Sent" className="tick-icon" height={16} width={16} />;
    if (status === "delivered") return <img src={DoubleGrayTick} alt="Delivered" className="tick-icon" height={16} width={16} />;
    if (status === "read") return <img src={DoubleBlueTick} alt="Read" className="tick-icon" height={16} width={16} />;
    return null;
  };

  const renderMessageContent = () => {
    if (messageType === "text") {
      return <p className="message-text">{message}</p>;
    }

    if (messageType === "photo" || messageType === "video" || messageType === "voice" || messageType === "attachment") {
      return (
        <div className="message-media-gallery">
          {message.map((attachment, index) => {
            if (attachment?.type.startsWith("image/")) {
              return (
                <div key={index} className="message-media-container">
                  {loading && <div className="loading-indicator">Loading...</div>}
                  <img src={attachment?.url} alt={attachment?.name} className="message-media" onLoad={() => setLoading(false)} height={200} width={300}/>
                </div>
              );
            }
            if (attachment.type.startsWith("video/")) {
              return (
                <div key={index} className="message-media-container">
                  {loading && <div className="loading-indicator">Loading...</div>}
                  <video className="message-media" controls onLoadedData={() => setLoading(false)} height={200} width={300}>
                    <source src={attachment?.url} type={attachment?.type} />
                    Your browser does not support the video tag.
                  </video>
                </div>
              );
            }
            if (attachment.type.startsWith("audio/")) {
              return (
                <div key={index} className="message-media-container">
                  {loading && <div className="loading-indicator">Loading...</div>}
                  <audio className="audio-main" controls onLoadedData={() => setLoading(false)}>
                    <source src={attachment?.url} type={attachment?.type} />
                    Your browser does not support the audio tag.
                  </audio>
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    }

    if (messageType === "voice") {
      return <audio className="audio-main" src={message.url} controls />;
    }

    return <p className="message-text">{message}</p>;
  };

  return (
    <div className={`message-card ${type}`}>
      {type === "message-left" && <img src={profilePic ?? "/assets/icons/profile-placeholder.svg"} alt="Profile" className="profile-pic" />}
      <div className="message-content">
        {type === "message-left" && <div className="user-name">{name}</div>}
        {renderMessageContent()}
        <div className="message-info">
          <span className="timestamp">{timeAgo}</span>
          {type === "message-right" && getStatusIcon()}
          {/* {type === "message-right" && (
            <div className="message-options">
              {showMenu && (
                <div className="message-options_menu">
                  <button className="delete-button" onClick={onDelete}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          )} */}
        </div>
      </div>
      {type === "message-right" && <img src={profilePic ?? "/assets/icons/profile-placeholder.svg"} alt="Profile" className="profile-pic" />}
    </div>
  );
};

export default MessageCard;
