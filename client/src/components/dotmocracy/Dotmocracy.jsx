import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Background from '../general/Background';

// declare this outside the component to avoid it re-connecting on any function call
let socket;

const Dotmocracy = () => {
  // const [postits, setPostits] = useState([]);
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    socket = io('/dotmocracy');
    window.io = socket;

    socket.on('msg', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  return (
    <Background>
      <input type="text" onChange={(e) => setName(e.target.value)} />
      <button type="button" onClick={() => socket.emit('name', name)}>Register name</button>
      <button type="button" onClick={() => socket.emit('room', 'TMM4220')}>Join room</button>
      {/* postits.map(({ id, text, dots }) => (
        <p key={id}>
          {`${text}, ${dots.length} votes`}
        </p>
      )) */}
      {messages.map((msg, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <p key={i}>{msg}</p>
      ))}
    </Background>
  );
};

export default Dotmocracy;
