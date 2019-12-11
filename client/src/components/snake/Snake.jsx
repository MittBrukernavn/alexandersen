import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`

`;

const Canvas = styled.canvas`
  height: 500px;
  width: 500px;
  border: 2px solid black;
`;

const Snake = props => {
  const canvasRef = useRef(null);
  const [ snake, setSnake ] = useState([[3, 5], [2, 5], [1, 5]]);
  const [ length, setLength ] = useState(3);
  const [ apples, setApples ] = useState(0);
  const [ applePos, setApplePos ] = useState([10, 10]);
  const [ direction, setDirection ] = useState([0, 0]);
  const [ prevdirection, setPrevdirection ] = useState([0,0]);
  const [ gameover, setGameover ] = useState(false);

  // draws whenever the snake changes
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    
    ctx.clearRect(0, 0, 1000, 1000);
    // apple
    ctx.beginPath();
    const [ appleX, appleY ] = applePos;
    ctx.fillStyle = 'red';
    ctx.fillRect(50 * appleX + 5, 50 * appleY + 5, 40, 40);
    // snake
    ctx.lineWidth = 40;
    
    if (gameover) {
      ctx.strokeStyle='orange';
    } else {
      ctx.strokeStyle='green';
    }
    ctx.beginPath();
    let [x, y] = snake[0];
    ctx.moveTo(50*x + 25, 50*y + 25);
    ctx.lineTo(50*x + 25, 50*y + 25);
    for (let i = 1; i < snake.length; i++) {
      const current = snake[i];
      [x, y] = current;
      ctx.lineTo(50*x + 25, 50*y + 25);
    }
    ctx.stroke();
    
  }, [snake, gameover]);

  const moveSnake = () => {
    const [x1, y1] = snake[0];
    setPrevdirection(direction);
    const [dx, dy] = direction;
    if (gameover || (dx === 0 && dy === 0)) {
      return;
    }
    const x2 = x1 + dx;
    const y2 = y1 + dy;
    const nextSnake = [[x2, y2], ...snake];
    if (nextSnake.length > length) {
      nextSnake.pop();
    }
    // check that snake did not crash
    if (x2 < 0 || x2 === 20 || y2 < 0 || y2 === 20) {
      setGameover(true);
      return;
    }
    // if did not crash, set next snake
    for (let i = 1; i < snake.length; i++) {
      const [x, y] = nextSnake[i];
      if(x2 === x && y2 === y) {
        setGameover(true);
        return;
      }
    }
    const [appleX, appleY] = applePos;
    if (x2 === appleX && y2 === appleY) {
      setLength(length + 2);
      setApples(apples + 1);
      // generate all eligible points:
      const eligPoints = [];
      for(let i = 0; i < 20; i++) {
        for(let j = 0; j < 20; j++) {
          let found = false;
          for (let point of snake) {
            const [x, y] = point;
            if (x === i && y === j) {
              found = true;
              break;
            }
          }
          if (!found) {
            eligPoints.push([i,j]);
          }
        }
      }
      const pt = eligPoints[Math.floor(Math.random() * eligPoints.length)];
      setApplePos(pt);
    }
    setSnake(nextSnake);
  }

  // game ticks
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
      if (dx !== -dxNew || dy !== -dyNew) {
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
      <h3>Score: {apples}</h3>
      <Canvas ref={canvasRef} width={1000} height={1000} />
    </Wrapper>
  );
}

export default Snake;
