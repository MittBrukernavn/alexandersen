import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';

import Background from '../general/Background';
import Members from './Members';

const Grid = styled.div`
  width: 100%;
  min-height: 100vh;
  flex: 1;
  display: grid;
  grid-template-columns: 1em 1fr 1fr 1em;
  grid-template-rows: 1em 1fr 1fr 1em;
  grid-template-areas:
    ". . . ."
    ". topleft topright ."
    ". botleft botright ."
    ". . . ."
`;

const GridItem = styled.div`
  grid-area: ${(props) => props.position};
`;

// declare this outside the component to avoid it re-connecting on any function call
let socket;

const Dotmocracy = () => {
  // const [postits, setPostits] = useState([]);
  const [postits, setPostits] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [roomInfo, setRoomInfo] = useState({});
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

  return (
    <Background>
      <Grid>
        <GridItem position="topleft">
          <input type="text" onChange={(e) => setName(e.target.value)} />
          <button type="button" onClick={() => socket.emit('name', name)}>Register name</button>
          <button type="button" onClick={() => socket.emit('room', 'TMM4220')}>Join room</button>
        </GridItem>
        {/* postits.map(({ id, text, dots }) => (
          <p key={id}>
            {`${text}, ${dots.length} votes`}
          </p>
        )) */}
        <GridItem position="botleft">
          {messages.map((msg, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <p key={i}>{msg}</p>
          ))}
        </GridItem>
        <GridItem position="topright">
          <Members members={members} decider={roomInfo.decider} />
        </GridItem>
      </Grid>
    </Background>
  );
};

export default Dotmocracy;
