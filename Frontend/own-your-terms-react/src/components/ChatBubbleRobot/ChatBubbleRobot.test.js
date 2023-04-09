import React from 'react';
import ReactDOM from 'react-dom';
import ChatBubbleRobot from './ChatBubbleRobot';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ChatBubbleRobot />, div);
  ReactDOM.unmountComponentAtNode(div);
});