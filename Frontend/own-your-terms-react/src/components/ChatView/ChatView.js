import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./ChatView.module.css";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import { useState } from "react";
import ChatBubbleRobot from "../ChatBubbleRobot/ChatBubbleRobot";
import ChatBubbleUser from "../ChatBubbleUser/ChatBubbleUser";
import SendIcon from "@mui/icons-material/Send";
import { BACKEND_URL, QUERY_URL } from "../../config";
import { Loading } from "react-loading-ui";

import axios from "axios";

const ChatView = () => {
  // type 0 - Robot
  // type 1 - User
  const [messages, setMessage] = useState([
    { type: 0, message: "Hi, How can I help you?" },
  ]);
  const [val, setVal] = useState("");

  const sendMessage = () => {
    Loading({
      title: "Crunching your data",
      text: "Please wait...",
      theme: "dark",
    });
    axios.post(BACKEND_URL + QUERY_URL, { query: val }).then((response) => {
      setMessage([
        ...messages,
        { type: 1, message: val },
        { type: 0, message: response.data.response },
      ]);
      Loading();
    });
  };
  useEffect(() => {
    setVal("");
  }, [messages]);
  const updateContent = (event) => {
    setVal(event.target.value);
  };

  return (
    <div className={styles.ChatView}>
      <div className={styles.chatContent}>
        <div>
          {messages.map((message, index) =>
            message.type === 0 ? (
              <ChatBubbleRobot message={message.message} URLs={message?.URLs} />
            ) : (
              <ChatBubbleUser message={message.message} />
            )
          )}
        </div>
      </div>
      <div className={styles.queryContent}>
        <div className={styles.typingSection}>
          <TextareaAutosize
            maxRows={1}
            aria-label="query-text"
            placeholder="Type in your query"
            defaultValue=""
            style={{ height: 50 }}
            className={styles.textBox}
            value={val}
            onChangeCapture={updateContent}
          />
        </div>
        <div className={styles.buttonSection}>
          <SendIcon
            onClick={() => {
              sendMessage();
            }}
          ></SendIcon>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
