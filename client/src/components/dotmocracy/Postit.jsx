import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
display: inline-block;
position: relative;
margin: 2em;
z-index: 0;
`;

const Canvas = styled.canvas`
width: 10em;
height: 10em;
margin: 0px;
z-index: 1;
`;

const P = styled.p`
position: absolute;
top: 0em;
left: 0em;
width: 10em;
height: 10em;
margin: 0px;
z-index: 10;
overflow: scroll;
`;

const Postit = ({ postit, socket }) => {
  const canvasRef = useRef(null);
  const { text, dots } = postit;

  const handleClick = (e) => {
    const { clientX, clientY, target } = e;
    const { offsetWidth, offsetHeight } = target; // computed width and height
    const scaleX = 100 / offsetWidth;
    const scaleY = 100 / offsetHeight;
    const { top, left } = target.getBoundingClientRect();
    const x = (clientX - left) * scaleX;
    const y = (clientY - top) * scaleY;
    socket.emit('vote', text, [x, y]);
  };

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, 100, 100);

    ctx.fillStyle = 'yellow';
    ctx.rect(0, 0, 100, 100);
    ctx.fill();
    ctx.stroke();

    dots.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.fillStyle = 'blue';
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [postit, dots]);

  return (
    <Wrapper>
      <Canvas height="100" width="100" ref={canvasRef} />
      <P onClick={handleClick}>{text}</P>
      <p>{`${dots.length} votes`}</p>
    </Wrapper>
  );
};

Postit.propTypes = {
  postit: PropTypes.shape({
    text: PropTypes.string.isRequired,
    dots: PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.number),
    ).isRequired,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  socket: PropTypes.object.isRequired,
};

export default Postit;
