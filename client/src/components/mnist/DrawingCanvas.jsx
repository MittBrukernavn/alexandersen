import React, { useState } from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  border: 1px solid black;
  width: 420px;
`;

const DrawingCanvas = ({ updatePixels }) => {
  const [isDrawing, setIsDrawing] = useState(false);

  const draw = (e) => {
    if(isDrawing) {
      const { target, clientX, clientY } = e;
      const { offsetLeft, offsetTop } = target;
      const x = Math.floor((clientX - offsetLeft) / 15);
      const y = Math.floor((clientY - offsetTop) / 15);
      const index = x + 28 * y;
      const ctx = target.getContext('2d');
      const { data } = ctx.getImageData(0, 0, 28, 28);
      // the pixel starts at 4 * index, want to set the opacity to max
      data[4 * index + 3] = 255;
      ctx.putImageData(new ImageData(data, 28, 28), 0, 0);
      const pixels = [];
      for(let i = 0; i < data.length; i += 4) {
        pixels.push(data[i + 3]);
      }
      updatePixels(pixels);
    }
  }

  return (
    <Canvas
      height={28}
      width={28}
      onMouseDown={() => setIsDrawing(true)}
      onMouseUp={() => setIsDrawing(false)}
      onMouseOut={() => setIsDrawing(false)}
      onMouseMove={draw}
    />
  );
};

export default DrawingCanvas;
