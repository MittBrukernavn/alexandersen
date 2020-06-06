import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import * as tf from '@tensorflow/tfjs';

import DrawingCanvas from './DrawingCanvas'

const Wrapper = styled.div`
  margin: 0 0.5em;
`;

const MNIST = () => {
  const [model, setModel] = useState(null);
  const [pixels, setPixels] = useState([]);
  const [digit, setDigit] = useState(-1);
  const [probability, setProbability] = useState(0);

  useEffect(() => {
    const internal = async () => {
      const m = await tf.loadLayersModel('/tfjs-mnist/model.json');
      console.log(m);
      setModel(m);
    };
    internal();
  }, []);

  useEffect(() => {
    if (model && pixels.length) {
      const prediction = model.predict(tf.tensor(pixels, [1, 784]));
      prediction.data().then((d) => {
        const prob = Math.max(...d);
        const dig = d.indexOf(prob);
        setDigit(dig);
        setProbability(prob);
      });
    }
  }, [model, pixels])

  let message;
  if (digit >= 0) {
    message = `My model is ${probability*100}% certain you wrote a ${digit}.`;
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
      <DrawingCanvas updatePixels={setPixels} />
      <p>
        {message}
      </p>
    </Wrapper>
  );
};

export default MNIST;
