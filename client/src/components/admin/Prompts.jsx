import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Table = styled.table`
  border: 1px solid black;
  border-collapse: collapse;
  & td, th {
    border: 1px solid black;
  }
`;

const Prompts = () => {
  const [id, setId] = useState(0);
  const [bingos, setBingos] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [newPrompt, setNewPrompt] = useState('');

  useEffect(() => {
    const internal = async () => {
      const res = await fetch('/api/bingo/');
      const j = await res.json();
      setBingos(j.bingos);
    };
    internal();
  },
  []);

  const changeBingo = async (e) => {
    const newId = e.target.value;
    setId(newId);
    const token = localStorage.getItem('token');
    const req = {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: { 'Content-Type': 'application/json' },
    };
    const res = await fetch(`/api/bingo/allPrompts/${newId}`, req);
    const j = await res.json();
    setPrompts(j.allPrompts);
  };

  const deletePrompt = async (promptId) => {
    const token = localStorage.getItem('token');
    const req = {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: { 'Content-Type': 'application/json' },
    };
    const res = await fetch(`/api/bingo/deletePrompt/${promptId}`, req);
    const { error } = await res.json();
    if (error) {
      console.log(error);
    } else {
      setPrompts(prompts.filter((p) => p.id !== promptId));
    }
  };

  const submitPrompt = async () => {
    const token = localStorage.getItem('token');
    const text = newPrompt;
    const req = {
      method: 'POST',
      body: JSON.stringify({ token, text }),
      headers: { 'Content-Type': 'application/json' },
    };
    const res = await fetch(`/api/bingo/newPrompt/${id}`, req);
    const { error, newId } = await res.json();
    if (error) {
      console.log(error);
    } else {
      setPrompts([...prompts, { text, id: newId }]);
      setNewPrompt('');
    }
  };

  return (
    <Wrapper>
      <select onChange={changeBingo}>
        {id === 0 ? <option value={0}>Velg bingo</option> : null}
        {bingos.map(({ id: bingoId, name }) => (
          <option key={bingoId} value={bingoId} onChange={changeBingo}>
            {name}
          </option>
        ))}
      </select>
      {' '}
      <br />
      {id !== 0 ? (
        <div>
          <input type="text" onChange={(e) => setNewPrompt(e.target.value)} value={newPrompt} />
          <br />
          <button type="button" onClick={submitPrompt}>Legg til</button>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {prompts.map(({ id: rowId, text }) => (
                <tr key={rowId}>
                  <td>{text}</td>
                  <td><button type="button" onClick={() => deletePrompt(rowId)}>Slett</button></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : null}
    </Wrapper>
  );
};

export default Prompts;
