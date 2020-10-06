import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Background from '../general/Background';

const Dotmocracy = () => {
  const [postits, setPostits] = useState([]);
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const socket = io('/dotmocracy');

  useEffect(() => {
    socket.on('init_postits', (p) => {
      setPostits((prev) => [...prev, ...p]);
    });

    socket.on('msg', (msg) => {
      console.log(msg);
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  return (
    <Background>
      <input type="text" onChange={(e) => setName(e.target.value)} />
      <button type="button" onClick={() => socket.emit('name', name)}>Register name</button>
      <button type="button" onClick={() => socket.emit('room', 'TMM4220')}>Join room</button>
      {postits.map(({ id, text, dots }) => (
        <p key={id}>
          {`${text}, ${dots.length} votes`}
        </p>
      ))}
      {messages.map((msg) => <p>{msg}</p>)}
    </Background>
  );
};

export default Dotmocracy;
