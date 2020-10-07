import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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

const Members = ({ members, decider }) => (
  <Wrapper>
    <H2>Connected users: </H2>
    <Ul>
      {members.map(({ userId, name, votesCast }) => (
        <li key={userId}>
          {userId === decider
            ? <Decider>{name}</Decider>
            : `${name}: ${votesCast}`}
        </li>
      ))}
    </Ul>
  </Wrapper>
);

Members.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape({
    userId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    votesCast: PropTypes.number.isRequired,
  })).isRequired,
  decider: PropTypes.string,
};

Members.defaultProps = {
  decider: null,
};

export default Members;
