import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ReviewRequests = () => {
  const [requests, setRequests] = useState([]);

  const getReq = () => ({
    method: 'POST',
    body: JSON.stringify({
      token: localStorage.getItem('token'),
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    const internal = async () => {
      const req = getReq();
      const res = await fetch('/api/bingo/reviewRequests', req);
      const j = await res.json();
      const { error, requests: receivedRequests } = j;
      if (error) {
        console.log('Something went wrong');
        console.log(error);
      } else {
        setRequests(receivedRequests);
      }
    };
    internal();
  }, []);

  const accept = async (id) => {
    const req = getReq();
    const res = await fetch(`/api/bingo/approveRequest/${id}`, req);
    const j = await res.json();
    if (j.error) {
      console.log('Something went wrong');
    } else {
      setRequests(requests.filter((r) => r.id !== id));
    }
  };

  const reject = async (id) => {
    const req = getReq();
    const res = await fetch(`/api/bingo/deleteRequest/${id}`, req);
    const j = await res.json();
    if (j.error) {
      console.log('Something went wrong:');
      console.log(j.error);
    } else {
      setRequests(requests.filter((r) => r.id !== id));
    }
  };

  return (
    <Wrapper>
      <table>
        <thead>
          <tr>
            <th>Bingo</th>
            <th>Prompt</th>
            <th>Accept</th>
            <th>Reject</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => {
            const { bingoName, id, promptText } = req;
            return (
              <tr key={id}>
                <td>{bingoName}</td>
                <td>{promptText}</td>
                <td><button type="button" onClick={() => accept(id)}>Accept</button></td>
                <td><button type="button" onClick={() => reject(id)}>Reject</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Wrapper>
  );
};

export default ReviewRequests;
