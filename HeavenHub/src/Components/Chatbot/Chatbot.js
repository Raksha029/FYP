import React, { useState } from "react";
import styles from "./Chatbot.module.css"; // Ensure this CSS file is updated
import chatbot from "../Assets/chatbot.png";

// Add at the top with other imports
import { useTranslation } from 'react-i18next';

const Chatbot = ({ onClose }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, sender: "user" },
      ]);
      setInput("");

      // Send user message to backend
      const response = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      // Simulate a bot response
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.response, sender: "bot" },
      ]);
    }
  };

  return (
    <div className={styles.chatbotContainer}>
      <div className={styles.chatHeader}>
        <div className={styles.chatLogo}>
          <img src={chatbot} alt={t('chatbot.title')} />
        </div>
        <h2 className={styles.chatTitle}>{t('chatbot.title')}</h2>
        <button onClick={onClose} className={styles.closeButton}>
          ✖
        </button>
      </div>
      <div className={styles.chatMessages}>
        {messages.length === 0 && (
          <div className={styles.botMessage}>
            {t('chatbot.welcomeMessage')}
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.sender === "user" ? styles.userMessage : styles.botMessage
            }
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className={styles.chatInput}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('chatbot.inputPlaceholder')}
          className={styles.inputField}
        />
        <button onClick={handleSend} className={styles.sendButton}>
          {t('chatbot.sendButton')}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;