import React from 'react';
import PropTypes from 'prop-types';

const Members = ({ members }) => (
  <div>
    {members.map(({ userId, name, votesCast }) => (
      <p key={userId}>
        {`${name}: ${votesCast}`}
      </p>
    ))}
  </div>
);

Members.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape({
    userId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    votesCast: PropTypes.number.isRequired,
  })).isRequired,
};

export default Members;
