import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  max-width: 25em;
  margin: 2em auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Error = styled.div`
  border: 1px solid #eb3434;
  background-color: #eb4d4d;
  border-radius: 0.2em;
  color: #690505;
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('waiting');
  const [error, setError] = useState('');

  const submit = async () => {
    const req = {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await fetch('/api/users/login', req);
    const { token, error: err } = await res.json();
    localStorage.setItem('token', token);
    if (err) {
      setError(err);
    } else {
      setStatus('ok');
    }
  };

  if (status === 'ok') {
    return <Redirect to="/admin/main" />;
  }

  return (
    <Wrapper>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      {' '}
      <br />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {' '}
      <br />
      <button type="button" onClick={submit}>Logg inn</button>
      {error ? (
        <Error>
          <p>
            Error:
            {' '}
            {error}
          </p>
        </Error>
      ) : null}
    </Wrapper>
  );
};

export default Login;
