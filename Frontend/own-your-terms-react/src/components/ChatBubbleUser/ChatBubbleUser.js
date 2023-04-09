import React from 'react';
import PropTypes from 'prop-types';
import styles from './ChatBubbleUser.module.css';

const ChatBubbleUser = (props) => {
  let message = props.message;
  return(
    <div className={styles.ChatBubbleUser}>
      <div className = {styles.ChatBubbleUserText}>
        {message}
      </div>
      
    </div>
  )
}
ChatBubbleUser.propTypes = {};

ChatBubbleUser.defaultProps = {};

export default ChatBubbleUser;
