import React, { useEffect, useRef, useState } from "react";
import styles from "./Chatbox.module.css";
import ChatBoxIcon from "./ChatBoxIcon";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";

const Chatbox = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatBot, setShowChatBot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    const addTypingEffect = async (text) => {
      let currentText = "";
      for (let i = 0; i < text.length; i++) {
        currentText += text[i];
        await new Promise((resolve) => setTimeout(resolve, 20));
        updateHistory(currentText, false, true);
      }
    };

    const updateHistory = (text, isError = false, isTyping = false) => {
      setChatHistory((prev) => {
        const updatedHistory = [...prev];
        if (isTyping) {
          // Update the last message (typing effect)
          updatedHistory[updatedHistory.length - 1].text = text;
        } else {
          // Add new message
          updatedHistory.push({ role: "model", text, isError });
        }
        return updatedHistory;
      });
    };

    // Format chat history for API request
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      // Add placeholder message for typing effect
      setChatHistory((prev) => [...prev, { role: "model", text: "", isError: false }]);

      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong!");

      // Extract and clean bot response text
      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();

      // Trigger typing effect
      await addTypingEffect(apiResponseText);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  // Auto-scroll to the bottom of the chat body
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div
      className={`${styles.container} ${showChatBot ? styles.showChatbot : ""}`}
    >
      {/* Chat toggle button */}
      <button
        onClick={() => setShowChatBot((prev) => !prev)}
        className={styles.chattoggler}
        id="chatbot-toggler"
      >
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">Close</span>
      </button>

      {/* Chat popup */}
      <div className={styles.chatpopup}>
        {/* Chat header */}
        <div className={styles.chatheader}>
          <div className={styles.chatheaderinfo}>
            <ChatBoxIcon />
            <div className={styles.chatlogotest}>Chatbox</div>
          </div>
          <button
            onClick={() => setShowChatBot((prev) => !prev)}
            className="material-symbols-rounded"
          >
            keyboard_arrow_down
          </button>
        </div>

        {/* Chat body */}
        <div ref={chatBodyRef} className={styles.chatbody}>
          {/* Bot's initial message */}
          <div className={styles.botmessage}>
            <div>
              <ChatBoxIcon />
            </div>
            <p className={styles.messagetext}>Hi! How can I help you today?</p>
          </div>

          {/* User and bot messages */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Chat footer */}
        <div className={styles.chatfooter}>
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
