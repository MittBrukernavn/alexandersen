import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1em;
  & > * {
    margin-top: 0.5em;
  }
`;

const BingoRequest = () => {
  const [bingos, setBingos] = useState([]);
  const [id, setId] = useState(0);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    const internal = async () => {
      const U = new URL(window.location.href);
      U.port = 5000;
      U.pathname = '/api/bingo/';
      const res = await fetch(U.href);
      const { bingos: receivedBingos } = await res.json();
      setBingos(receivedBingos);
    };
    internal();
  }, []);

  const submit = async () => {
    const req = {
      method: 'POST',
      body: JSON.stringify({
        prompt,
      }),
      headers: { 'Content-Type': 'application/json' },
    };
    const U = new URL(window.location.href);
    U.port = 5000;
    U.pathname = `/api/bingo/request/${id}`;
    const r = await fetch(U.href, req);
    const j = await r.json();
    if (j.status === 'ok') {
      setPrompt('');
    }
  };

  return (
    <Wrapper>
      <select value={id} onChange={(e) => setId(e.target.value)}>
        <option value={0}>Velg</option>
        {bingos.map((bingo) => <option key={bingo.id} value={bingo.id}>{bingo.name}</option>)}
      </select>
      <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button type="button" onClick={submit}>Send</button>
    </Wrapper>
  );
};

export default BingoRequest;
