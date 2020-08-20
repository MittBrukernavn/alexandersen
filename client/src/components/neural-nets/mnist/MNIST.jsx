import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import * as tf from '@tensorflow/tfjs';

import zeros from '../../../utils/zeros';
import DrawingCanvas from './DrawingCanvas';

const Wrapper = styled.div`
  margin: 0 0.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MNIST = () => {
  const [model, setModel] = useState(null);
  const [pixels, setPixels] = useState(zeros(784));
  const [drawn, setDrawn] = useState(false);
  const [digit, setDigit] = useState(-1);
  const [probability, setProbability] = useState(0);

  useEffect(() => {
    const internal = async () => {
      const m = await tf.loadLayersModel('/tfjs-mnist/model.json');
      setModel(m);
    };
    internal();
  }, []);

  useEffect(() => {
    if (model && drawn) {
      const prediction = model.predict(tf.tensor(pixels, [1, 784]));
      prediction.data().then((d) => {
        const prob = Math.max(...d);
        const dig = d.indexOf(prob);
        setDigit(dig);
        setProbability(prob);
      });
    }
  }, [model, pixels, drawn]);

  const handleDrawn = (p) => {
    setPixels(p);
    setDrawn(true);
  };

  let message;
  if (digit >= 0) {
    if (probability < 0.5) {
      message = `My model doesn't have a clue, but its best guess is ${digit}`;
    } else if (probability < 0.75) {
      message = `My model believes this is a ${digit}, but isn't quite sure.`;
    } else if (probability < 0.95) {
      message = `My model believes quite strongly this is a ${digit}`;
    } else if (probability < 0.999) {
      message = `My model is very confident this is a ${digit}`;
    } else {
      message = `My model is completely sure this is a ${digit}`;
    }
  } else if (model) {
    message = 'Start drawing and I\'ll try to read it!';
  } else {
    message = 'Model is loading, shouldn\'t take too long';
  }

  return (
    <Wrapper>
      <h1>MNIST-project</h1>
      <p>
        Write a number here. Hopefully, the model is be able to read it.
        If not, my excuse is that I am new to this.
      </p>
      <DrawingCanvas updatePixels={handleDrawn} />
      <p>
        {message}
      </p>
    </Wrapper>
  );
};

export default MNIST;
