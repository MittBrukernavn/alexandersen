import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Background from '../general/Background';
import Members from './Members';

// declare this outside the component to avoid it re-connecting on any function call
let socket;

const Dotmocracy = () => {
  // const [postits, setPostits] = useState([]);
  const [postits, setPostits] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    socket = io('/dotmocracy');
    window.io = socket;

    socket.on('msg', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('init room', (roomdata) => {
      const {
        postits: receivedPostits,
        members: receivedMembers,
        // normalVotes,
        // deciderVotes,
        // decider
      } = roomdata;
      setPostits(receivedPostits);
      setMembers(receivedMembers);
    });

    socket.on('new user', (user) => {
      setMembers((prev) => [...prev, user]);
    });

    socket.on('remove user', (userId) => {
      setMembers((prev) => prev.filter((user) => userId !== user.userId));
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
      <Members members={members} />
    </Background>
  );
};

export default Dotmocracy;
