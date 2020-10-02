import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Background from '../general/Background';

const Dotmocracy = () => {
  const [messages, setMessages] = useState([]);
  const socket = io();

  useEffect(() => {
    socket.on('message', (s) => {
      console.log(messages);
      setMessages((msgs) => [...msgs, s]);
    });
  }, []);

  return (
    <Background>
      {messages.map((msg) => <p>{ msg }</p>)}
    </Background>
  );
};

export default Dotmocracy;
