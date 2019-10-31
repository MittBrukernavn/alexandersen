import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 50em;
  margin: auto;
  & input {
    align-self:flex-start;
  }
  & * {
    margin: 0.2em;
  }
`;

const NewBingo = props => {
  const [name, setName] = useState('');
  const [freeSpace, setFreeSpace] = useState('');
  const [allPrompts, setAllPrompts] = useState('');
  const [description, setDescription] = useState('');

  const submit = async () => {
    const allPromptsAsList = allPrompts.split('\n');
    const token = localStorage.getItem('token');
    const req = {
      method: 'POST',
      body: JSON.stringify({
        name,
        freeSpace,
        description,
        allPrompts: allPromptsAsList,
        token
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    console.log(req);
    const U = new URL(window.location.href);
    U.port=5000;
    U.pathname='/api/bingo/';
    const res = await fetch(U.href, req);
    console.log(res);
  }

  return (
    <Wrapper>
      <input type="text" value={name} placeholder="Name" onChange={e=>setName(e.target.value)} />
      <input type="text" value={freeSpace} placeholder="Free Space" onChange={e=>setFreeSpace(e.target.value)} />
      <textarea value={description} placeholder="Description" onChange={e=>setDescription(e.target.value)} />
      <textarea value={allPrompts} placeholder="Prompts (one per line)" onChange={e=>setAllPrompts(e.target.value)} />
      <button type="button" onClick={submit}>Submit</button>
    </Wrapper>
  );
}

export default NewBingo;
