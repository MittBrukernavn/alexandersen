import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: auto;
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
  const [ gameover, setGameover ] = useState(false);

  // draws whenever the snake changes
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const tileSize = 50;
    const spacing = 5;
    const spacedWidth = tileSize - 2 * spacing;
    
    ctx.clearRect(0, 0, 1000, 1000);
    // apple
    ctx.beginPath();
    const [ appleX, appleY ] = applePos;
    ctx.fillStyle = 'red';
    ctx.fillRect(tileSize * (appleX + 0.5) - 20, tileSize * (appleY + 0.5)  - 20, spacedWidth, spacedWidth);
    // snake
    ctx.lineWidth = spacedWidth;
    
    if (gameover) {
      ctx.strokeStyle='orange';
    } else {
      ctx.strokeStyle='green';
    }
    ctx.beginPath();
    const [headx, heady] = snake[0];
    const [prevx, prevy] = snake[1];
    const [ dx, dy ] = [headx-prevx, heady-prevy];
    let [x, y] = snake[0];
    ctx.moveTo(tileSize * (x + 0.5 + 0.5 * dx) - (dx * spacing), tileSize * (y + 0.5 + 0.5 * dy) - (dy * spacing));
    for (let i = 1; i < snake.length; i++) {
      [x, y] = snake[i];
      ctx.lineTo(tileSize * (x + 0.5), tileSize * (y + 0.5));
    }

    ctx.stroke();
    
  }, [snake, applePos, gameover]);

  const moveSnake = () => {
    const [x1, y1] = snake[0];
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
          for (let point of nextSnake) {
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
      const [headx, heady] = snake[0];
      const [prevx, prevy] = snake[1];
      const [ dx, dy ] = [headx-prevx, heady-prevy];
      const [dxNew, dyNew] = proposedDirection;
      if (dx !== -dxNew || dy !== -dyNew) {
        setDirection([dxNew, dyNew]);
      }
    };
    window.addEventListener('keydown', keyDownHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, [snake]);

  return (
    <Wrapper>
      <h3>Score: {apples}</h3>
      <Canvas ref={canvasRef} width={1000} height={1000} />
    </Wrapper>
  );
}

export default Snake;
