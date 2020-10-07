import React from 'react';
import PropTypes from 'prop-types';

const Postit = ({ postit, socket }) => {
  const { text, dots } = postit;

  return (
    <button
      type="button"
      key={text}
      onClick={() => socket.emit('vote', text)}
    >
      {`${text}, ${dots.length} votes`}
    </button>
  );
};

Postit.propTypes = {
  postit: PropTypes.shape({
    text: PropTypes.string.isRequired,
    dots: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  socket: PropTypes.object.isRequired,
};

export default Postit;
