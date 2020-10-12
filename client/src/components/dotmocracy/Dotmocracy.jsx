import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';

import Background from '../general/Background';
import Body from '../general/Body';
import Members from './Members';
import Setup from './Setup';
import Postit from './Postit';
import MakePostit from './MakePostit';

const RowWrap = styled.div`
display: flex;
flex-flow: row wrap;
`;

// declare this outside the component to avoid it re-connecting on all method calls
const socket = io('/dotmocracy');

const Dotmocracy = () => {
  const [phase, setPhase] = useState('setup');
  const [postits, setPostits] = useState([]);
  const [members, setMembers] = useState([]);
  const [roomInfo, setRoomInfo] = useState({
    name: '',
    normalVotes: -1,
    deciderVotes: -1,
    decider: null,
  });

  const initialRoomName = (new URL(window.location.href)).searchParams.get('room');

  useEffect(() => {
    socket.on('msg', console.log);

    socket.on('init room', (roomdata) => {
      const {
        postits: receivedPostits,
        members: receivedMembers,
        ...receivedRoomInfo
      } = roomdata;
      setPostits(receivedPostits);
      setMembers(receivedMembers);
      setRoomInfo(receivedRoomInfo);
    });

    socket.on('new user', (user) => {
      setMembers((prev) => [...prev, user]);
    });

    socket.on('remove user', (userId) => {
      setMembers((prev) => prev.filter((user) => userId !== user.userId));
    });

    socket.on('new postit', (newPostit) => {
      setPostits((prev) => [...prev, newPostit]);
    });

    socket.on('new vote', (votedPostitText, coords) => {
      setPostits((prev) => {
        const postitsCopy = [...prev];
        const votedPostit = postitsCopy.find(({ text }) => text === votedPostitText);
        if (votedPostit) {
          votedPostit.dots = [...votedPostit.dots, coords];
        }
        return postitsCopy;
      });
    });
  }, []);

  if (phase === 'setup') {
    return (
      <Setup socket={socket} onFinish={() => setPhase('suggestions')} initialRoomName={initialRoomName} />
    );
  }

  return (
    <Background>
      <Body>
        <Members members={members} decider={roomInfo.decider} roomName={roomInfo.name} />
        <RowWrap>
          {postits.map((p) => <Postit key={p.text} postit={p} socket={socket} />)}
        </RowWrap>
        <MakePostit socket={socket} />
      </Body>
    </Background>
  );
};

export default Dotmocracy;
