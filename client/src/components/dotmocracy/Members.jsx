import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import copyToClipboard from '../../utils/copyToClipboard';

const Wrapper = styled.div`
text-align: left;
margin: auto;
`;

const Decider = styled.span`
color: red;
`;

const Ul = styled.ul`
margin: auto;
text-align: left;
`;

const H2 = styled.h2`
margin: 0px  0px;
`;

const Members = ({ members, decider, roomName }) => {
  const [expand, setExpand] = useState(false);
  if (expand) {
    return (
      <Wrapper>
        <H2>Connected users: </H2>
        <Ul>
          {members.map(({ userId, name }) => (
            <li key={userId}>
              {userId === decider
                ? <Decider>{name}</Decider>
                : name}
            </li>
          ))}
        </Ul>
        <button type="button" onClick={() => copyToClipboard(`https://${document.domain}/dotmocracy?room=${roomName}`)}>Copy invite link</button>
        <button type="button" onClick={() => setExpand(false)}>Hide users</button>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <button type="button" onClick={() => setExpand(true)}>Show members</button>
    </Wrapper>
  );
};

Members.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape({
    userId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    votesCast: PropTypes.number.isRequired,
  })).isRequired,
  roomName: PropTypes.string.isRequired,
  decider: PropTypes.string,
};

Members.defaultProps = {
  decider: null,
};

export default Members;
