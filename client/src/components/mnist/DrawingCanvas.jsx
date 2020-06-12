import React, { useState } from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  border: 1px solid black;
  touch-action: none;
`;

const DrawingCanvas = ({ updatePixels }) => {
  const [isDrawing, setIsDrawing] = useState(false);

  const addPoint = (ctx, x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2*Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
    const { data } = ctx.getImageData(0, 0, 420, 420);
    // update pixels in parent component
    const pixels = [];
    for(let imgY = 0; imgY < 28; imgY++) {
      for(let imgX = 0; imgX < 28; imgX++) {
        let thispixel = 0;
        for(let i = 0; i < 15; i++) {
          for(let j = 0; j < 15; j++) {
            const imgIndex = (imgX*15 + i) + 420 * (imgY*15 + j);
            thispixel += data[4 * imgIndex + 3];
          }
        }
        console.log(thispixel);
        pixels.push(thispixel / 225);
      }
    }
    updatePixels(pixels);
    console.log(Math.max(...pixels));
  }

  const mouseDraw = (e) => {
    if(isDrawing) {
      const { target, clientX, clientY } = e;
      const { offsetLeft, offsetTop } = target;
      const x = Math.floor(clientX - offsetLeft);
      const y = Math.floor(clientY - offsetTop);
      const ctx = target.getContext('2d');
      addPoint(ctx, x, y);
    }
  }

  const touchDraw = (e) => {
    e.preventDefault();
    const { target, touches } = e;
    const ctx = target.getContext('2d');
    const { top, left } = target.getBoundingClientRect();
    for(let i = 0; i < touches.length; i++) {
      const { pageX, pageY } = touches[i];
      const x = Math.floor(pageX - left);
      const y = Math.floor(pageY - top);
      addPoint(ctx, x, y);
    }
  }

  return (
    <>
      <Canvas
        height={420}
        width={420}
        onMouseDown={() => setIsDrawing(true)}
        onMouseUp={() => setIsDrawing(false)}
        onMouseOut={() => setIsDrawing(false)}
        onMouseMove={mouseDraw}
        onTouchStart={touchDraw}
        onTouchMove={touchDraw}
      />
    </>
  );
};

export default DrawingCanvas;
