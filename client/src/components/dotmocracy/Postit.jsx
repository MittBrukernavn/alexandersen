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
width: 12em;
height: 12em;
margin: 0px;
z-index: 1;
`;

const P = styled.p`
position: absolute;
top: 0em;
left: 0em;
width: 12em;
height: 12em;
margin: 0px;
z-index: 10;
overflow: scroll;
`;

const canvasHeight = 500;
const canvasWidth = 500;

const Postit = ({ postit, socket }) => {
  const canvasRef = useRef(null);
  const { text, dots } = postit;

  const handleClick = (e) => {
    const { clientX, clientY, target } = e;
    const { offsetWidth, offsetHeight } = target; // computed width and height
    const scaleX = canvasWidth / offsetWidth;
    const scaleY = canvasHeight / offsetHeight;
    const { top, left } = target.getBoundingClientRect();
    const x = (clientX - left) * scaleX;
    const y = (clientY - top) * scaleY;
    socket.emit('vote', text, [x, y]);
  };

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = 'yellow';
    ctx.rect(0, 0, canvasWidth, canvasHeight);
    ctx.fill();
    ctx.stroke();

    dots.forEach(({ coordinates: [x, y], decider }) => {
      const color = decider ? 'red' : 'blue';
      const radius = decider ? 20 : 10;
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [postit, dots]);

  return (
    <Wrapper>
      <Canvas height={canvasHeight} width={canvasWidth} ref={canvasRef} />
      <P onClick={handleClick}>{text}</P>
      <p>{`${dots.length} votes`}</p>
    </Wrapper>
  );
};

Postit.propTypes = {
  postit: PropTypes.shape({
    text: PropTypes.string.isRequired,
    dots: PropTypes.arrayOf(
      PropTypes.shape({
        coordinates: PropTypes.arrayOf(PropTypes.number),
        decider: PropTypes.bool.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  socket: PropTypes.object.isRequired,
};

export default Postit;
