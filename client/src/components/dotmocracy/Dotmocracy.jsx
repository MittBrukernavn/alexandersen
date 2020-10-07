import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Background from '../general/Background';
import Body from '../general/Body';
import Members from './Members';


// declare this outside the component to avoid it re-connecting on any function call
let socket;

const Dotmocracy = () => {
  // const [postits, setPostits] = useState([]);
  const [phase, setPhase] = useState('choose name');
  const [name, setName] = useState('');
  const [roomName, setRoomName] = useState('TMM4220');
  const [postits, setPostits] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [roomInfo, setRoomInfo] = useState({});

  // creates a callback for setting the phase if the parameter is set to true
  const setPhaseOnSuccess = (newPhase) => (success) => {
    if (success) {
      setPhase(newPhase);
    }
  };

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
        ...receivedRoomInfo
      } = roomdata;
      setPostits(receivedPostits);
      setMembers(receivedMembers);
      setRoomInfo(receivedRoomInfo); // normalVotes, deciderVotes, decider
    });

    socket.on('new user', (user) => {
      setMembers((prev) => [...prev, user]);
    });

    socket.on('remove user', (userId) => {
      setMembers((prev) => prev.filter((user) => userId !== user.userId));
    });
  }, []);
  if (phase === 'choose name') {
    return (
      <Background>
        <Body>
          <h2>What is your name?</h2>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <button type="button" onClick={() => socket.emit('name', name, setPhaseOnSuccess('choose room'))}>
            Register
          </button>
        </Body>
      </Background>
    );
  }
  if (phase === 'choose room') {
    return (
      <Background>
        <Body>
          <h2>Enter a room to join</h2>
          <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
          <button type="button" onClick={() => socket.emit('room', 'TMM4220', setPhaseOnSuccess('room'))}>
            Join room
          </button>
        </Body>
      </Background>
    );
  }
  return (
    <Background>
      <Body>
        <Members members={members} decider={roomInfo.decider} />
        {messages.map((msg, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <p key={i}>{msg}</p>
        ))}
      </Body>
      {/* postits.map(({ id, text, dots }) => (
        <p key={id}>
          {`${text}, ${dots.length} votes`}
        </p>
      )) */}
    </Background>
  );
};

export default Dotmocracy;
