import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Background from '../general/Background';
import Body from '../general/Body';
import Members from './Members';
import Setup from './Setup';


// declare this outside the component to avoid it re-connecting on any function call
const socket = io('/dotmocracy');

const Dotmocracy = () => {
  // const [postits, setPostits] = useState([]);
  const [phase, setPhase] = useState('setup');
  const [postits, setPostits] = useState([]);
  const [members, setMembers] = useState([]);
  const [roomInfo, setRoomInfo] = useState({});

  useEffect(() => {
    window.io = socket;

    socket.on('msg', console.log);

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

  if (phase === 'setup') {
    return (
      <Background>
        <Setup socket={socket} onFinish={() => setPhase('suggestions')} />
      </Background>
    );
  }

  return (
    <Background>
      <Body>
        <Members members={members} decider={roomInfo.decider} />
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
