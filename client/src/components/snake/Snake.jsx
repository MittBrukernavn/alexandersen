import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`

`;

const Canvas = styled.canvas`
  height: 500px;
  width: 500px;
`;

const Snake = props => {
  const canvasRef = useRef(null);
  const [ snake, setSnake ] = useState([[3, 5], [2, 5], [1, 5]]);
  const [ length, setLength ] = useState(5);
  const [ direction, setDirection ] = useState([1,0]);
  const [ prevdirection, setPrevdirection ] = useState([1,0]);
  const [ gameover, setGameover ] = useState(false);

  // draws whenever the snake changes
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth = 40;
    if (gameover) {
      ctx.strokeStyle='red';
    }
    ctx.clearRect(0, 0, 1000, 1000);
    ctx.beginPath();
    let [x, y] = snake[0];
    ctx.moveTo(50*x, 50*y);
    ctx.lineTo(50*x, 50*y);
    for (let i = 0; i < snake.length; i++) {
      const current = snake[i];
      let [x, y] = current;
      ctx.lineTo(50*x, 50*y);
    }
    ctx.stroke();
  }, [snake, gameover]);

  const moveSnake = () => {
    if (gameover) {
      return;
    }
    const [x1, y1] = snake[0];
    setPrevdirection(direction);
    const [dx, dy] = direction;
    const x2 = x1 + dx;
    const y2 = y1 + dy;
    const nextSnake = [[x2, y2], ...snake];
    if (nextSnake.length > length) {
      nextSnake.pop();
    }
    // check that snake did not crash
    if (x2 === 0 || x2 === 20 || y2 === 0 || y2 === 20) {
      console.log('LOSE');
      setGameover(true);
      return;
    }
    // if did not crash, set next snake
    for (let i = 1; i < snake.length; i++) {
      const [x, y] = nextSnake[i];
      if(x2 === x && y2 === y) {
        console.log('LOSE');
        setGameover(true);
        return;
      }
    }
    setSnake(nextSnake);
  }

  useEffect(() => {
    const a = setTimeout(moveSnake, 200);
    return () => clearTimeout(a);
  }, [moveSnake]);
  
  // keyboard input
  useEffect(() => {
    const keyDownHandler = (event) => {
      const inputToDirection = {
        37: [-1, 0],  // left
        38: [0, -1],  // up
        39: [1, 0],   // right
        40: [0, 1]    // down
      };
      const { keyCode } = event;
      const proposedDirection = inputToDirection[keyCode];
      if (proposedDirection === undefined) {
        return;
      }
      const [dx, dy] = prevdirection;
      const [dxNew, dyNew] = proposedDirection;
      if (dx === -dxNew && dy === -dyNew) {
        console.log('Invalid');
      } else {
        setDirection([dxNew, dyNew]);
      }
    };
    window.addEventListener('keydown', keyDownHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, [prevdirection]);

  return (
    <Wrapper>
      <Canvas ref={canvasRef} width={1000} height={1000} />
    </Wrapper>
  );
}

export default Snake;
