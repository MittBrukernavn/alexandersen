import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  align-items: center;
`;

const Canvas = styled.canvas`
  border: 1px solid black;
  width: 420px;
  touch-action: none;
`;

const DrawingCanvas = ({ updatePixels }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(5)

  const addPoint = (ctx, x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, 2*Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
    const { data } = ctx.getImageData(0, 0, 280, 280);
    // update pixels in parent component
    const pixels = [];
    for(let imgY = 0; imgY < 28; imgY++) {
      for(let imgX = 0; imgX < 28; imgX++) {
        let thispixel = 0;
        for(let i = 0; i < 10; i++) {
          for(let j = 0; j < 10; j++) {
            const imgIndex = (imgX*10 + i) + 280 * (imgY*10 + j);
            thispixel += data[4 * imgIndex + 3];
          }
        }
        console.log(thispixel);
        pixels.push(thispixel / 100);
      }
    }
    updatePixels(pixels);
    console.log(Math.max(...pixels));
  }

  const mouseDraw = (e) => {
    if(isDrawing) {
      const { target, clientX, clientY } = e;
      const { offsetLeft, offsetTop } = target;
      const x = Math.floor((clientX - offsetLeft) / 1.5);
      const y = Math.floor((clientY - offsetTop) / 1.5);
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
      const x = Math.floor((pageX - left) / 1.5);
      const y = Math.floor((pageY - top) / 1.5);
      addPoint(ctx, x, y);
    }
  }

  return (
    <Wrapper>
      <Canvas
        height={280}
        width={280}
        onMouseDown={() => setIsDrawing(true)}
        onMouseUp={() => setIsDrawing(false)}
        onMouseOut={() => setIsDrawing(false)}
        onMouseMove={mouseDraw}
        onTouchStart={touchDraw}
        onTouchMove={touchDraw}
      />
      <label htmlFor="brushSizeRange">
        Brush size:
        <input
          id="brushSizeRange"
          type="range"
          min={1}
          max={10}
          value={brushSize}
          onChange={(e) => setBrushSize(e.target.value)}
        />
      </label>
    </Wrapper>
  );
};

export default DrawingCanvas;
