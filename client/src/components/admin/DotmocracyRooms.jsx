import React, { useState, useEffect } from 'react';

import Background from '../general/Background';
import Body from '../general/Body';

const DotmocracyRooms = () => {
  const [loading, setLoading] = useState(true);
  const [dotmocracies, setDotmocracies] = useState({});

  useEffect(() => {
    const internal = async () => {
      const token = localStorage.getItem('token');
      const req = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await fetch('/api/dotmocracy', req);
      console.log(res);
      const j = await res.json();
      console.log(j); 
      setDotmocracies(j);
      setLoading(false);
    };

    internal();
  }, []);

  if (loading) {
    return (
      <Background>
        <Body>
          Loading...
        </Body>
      </Background>
    );
  }

  return (
    <Background>
      <Body>
        <h2>Active dotmocracy rooms</h2>
        <ul>
          {Object.values(dotmocracies).map(({ name, members }) => (
            <a href={`/dotmocracy?room=${name}`}>
              <li>
                {`${name} (${members.length} ${members.length === 1 ? 'user' : 'users'})`}
              </li>
            </a>
          ))}
        </ul>
      </Body>
    </Background>
  );
};

export default DotmocracyRooms;
