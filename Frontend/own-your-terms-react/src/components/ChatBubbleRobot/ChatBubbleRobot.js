import React from 'react';
import PropTypes from 'prop-types';
import styles from './ChatBubbleRobot.module.css';

const ChatBubbleRobot = (props) => {
  let textMessage = props.message;
  let URLs = props.URLs;
  return(
    <div className={styles.ChatBubbleRobot}>
      <div className = {styles.ChatBubbleRobotText}>
        <div>{textMessage}</div>
        <div className= {styles.ChatBubbleRobotUrlSection} >
        {
        URLs?.map((url) => 
          <div >
            <br></br>
            <a className = {styles.ChatBubbleRobotUrl} href = {url}>Link to Supporting Document</a>
          </div>
      )
      }
      </div>
      </div>
    </div>
  )
}

ChatBubbleRobot.propTypes = {};

ChatBubbleRobot.defaultProps = {};

export default ChatBubbleRobot;
