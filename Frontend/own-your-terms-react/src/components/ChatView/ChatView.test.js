import React from 'react';
import ReactDOM from 'react-dom';
import ChatView from './ChatView';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ChatView />, div);
  ReactDOM.unmountComponentAtNode(div);
});