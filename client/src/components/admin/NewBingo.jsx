import React, { useState } from 'react';

const NewBingo = props => {
  const [name, setName] = useState('');
  const [freeSpace, setFreeSpace] = useState('');
  const [allPrompts, setAllPrompts] = useState('');

  const submit = async () => {
    const allPromptsAsList = allPrompts.split('\n');
    const token = localStorage.getItem('token');
    const req = {
      method: 'POST',
      body: JSON.stringify({
        name,
        freeSpace,
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
    <div>
      <input type="text" value={name} placeholder="Name" onChange={e=>setName(e.target.value)} /><br/>
      <input type="text" value={freeSpace} placeholder="Free Space" onChange={e=>setFreeSpace(e.target.value)} /><br/>
      <textarea value={allPrompts} onChange={e=>setAllPrompts(e.target.value)} /><br/>
      <button type="button" onClick={submit}>Submit</button>
    </div>
  );
}

export default NewBingo;
