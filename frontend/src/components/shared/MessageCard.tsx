import React from "react";
import SingleTick from "/assets/icons/single-tick.svg";
import DoubleGrayTick from "/assets/icons/double-tick.svg";
import DoubleBlueTick from "/assets/icons/double-tick-blue.svg";

const MessageCard = ({ message, messageType, type, timestamp, status, profilePic }) => {
  const getStatusIcon = () => {
    if (status === "Sent") return <img src={SingleTick} alt="Sent" className="tick-icon" height={16} width={16} />;
    if (status === "Delivered") return <img src={DoubleGrayTick} alt="Delivered" className="tick-icon" height={16} width={16} />;
    if (status === "Read") return <img src={DoubleBlueTick} alt="Read" className="tick-icon" height={16} width={16} />;
    return null;
  };

  const renderMessageContent = () => {
    switch (messageType) {
      case "text":
        return <p className="message-text">{message}</p>;
      case "photo":
        return <img src={message} alt="Photo" className="message-media" />;
      case "video":
        return (
          <video className="message-media" controls>
            <source src={message} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case "voice":
        return (
          <audio className="audio-main" src={message} controls/>
        );
      default:
        return <p className="message-text">{message}</p>;
    }
  };

  return (
    <div className={`message-card ${type}`}>
      {type === "message-left" && <img src={profilePic} alt="Profile" className="profile-pic" />}
      <div className="message-content">
        {renderMessageContent()}
        <div className="message-info">
          <span className="timestamp">{timestamp}</span>
          {type === "message-right" && getStatusIcon()}
        </div>
      </div>
      {type === "message-right" && <img src={profilePic} alt="Profile" className="profile-pic" />}
    </div>
  );
};

export default MessageCard;
