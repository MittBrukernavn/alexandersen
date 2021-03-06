import React, { useState } from 'react';
import PropTypes from 'prop-types';

const MakePostit = ({ socket }) => {
  const [text, setText] = useState('');

  return (
    <div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button
        type="button"
        onClick={() => socket.emit('make postit', text, (success) => {
          if (success) {
            setText('');
          }
        })}
      >
        Post
      </button>
    </div>
  );
};

MakePostit.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  socket: PropTypes.object.isRequired,
};

export default MakePostit;
