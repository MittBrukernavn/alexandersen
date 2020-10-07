import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Decider = styled.span`
color: red;
`;

const Ul = styled.ul`
  text-align: left;
`;

const Members = ({ members, decider }) => (
  <div>
    <h2>Connected users: </h2>
    <Ul>
      {members.map(({ userId, name, votesCast }) => (
        <li key={userId}>
          {userId === decider
            ? <Decider>{name}</Decider>
            : `${name}: ${votesCast}`}
        </li>
      ))}
    </Ul>
  </div>
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
