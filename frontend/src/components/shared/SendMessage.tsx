import React from "react";
import { Button } from "../ui";
import InputEmoji from "react-input-emoji";

function SendMessage({ text, setText, handleOnEnter, placeholder }: any) {
  return (
    <span className="w-full flex items-center gap-1">
      <InputEmoji
        value={text}
        onChange={setText}
        cleanOnEnter={true}
        onEnter={handleOnEnter}
        color="white"
        placeholder={placeholder}
        background="#0f172a"
        borderColor="gray"
      />
      <Button
        variant="ghost"
        className="flex justify-center"
        onClick={() => handleOnEnter(text)}
      >
        <img
          src="/assets/icons/send-comment.svg"
          alt="send"
          width={25}
          height={25}
          title="Send"
        />
      </Button>
    </span>
  );
}

export default SendMessage;
