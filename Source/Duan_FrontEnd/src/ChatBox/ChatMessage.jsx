import React from 'react';
import styles from "./Chatbox.module.css";
import ChatBoxIcon from './ChatBoxIcon';

const ChatMessage = ({ chat }) => {
  return (
    <div
      className={`${chat.role === "model" ? styles.botmessage : styles.usermessage} ${
        chat.isError ? styles.error : ""
      }`}
    >
      {chat.role === "model" && <div><ChatBoxIcon /></div>}
      <p className={styles.messagetext}>
        {chat.text}
      </p>
    </div>
  );
};

export default ChatMessage;
