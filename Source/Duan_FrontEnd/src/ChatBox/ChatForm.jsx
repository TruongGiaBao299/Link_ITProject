import React, { useRef } from "react";
import styles from "./Chatbox.module.css";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";

    // update chat history with user message
    setChatHistory((history) => [
      ...history,
      { role: "user", text: userMessage },
    ]);

    // chat response
    setTimeout(() => {
      // function to generate bot response
      generateBotResponse([
        ...chatHistory,
        { role: "user", text: userMessage },
      ]);
    }, 600);
  };

  return (
    <form onSubmit={handleFormSubmit} action="#" className={styles.chatform}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message....."
        className={styles.messageinput}
        required
      />
      <button className="material-symbols-rounded">arrow_upward</button>
    </form>
  );
};

export default ChatForm;
