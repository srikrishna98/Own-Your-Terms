import React from "react";
import PropTypes from "prop-types";
import styles from "./ChatBubbleRobot.module.css";
import { Link } from "react-router-dom";

const ChatBubbleRobot = (props) => {
  let textMessage = props.message;
  let URLs = props.URLs;
  return (
    <div className={styles.ChatBubbleRobot}>
      <div className={styles.ChatBubbleRobotText}>
        <div dangerouslySetInnerHTML={{ __html: textMessage }}></div>
        <div className={styles.ChatBubbleRobotUrlSection}>
          {URLs?.map((url) => (
            <div>
              <br></br>
              <Link className={styles.ChatBubbleRobotUrl} to={url}>
                Link to Supporting Document
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ChatBubbleRobot.propTypes = {};

ChatBubbleRobot.defaultProps = {};

export default ChatBubbleRobot;
