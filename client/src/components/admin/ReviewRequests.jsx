import React, { useState, useEffect } from 'react';


const ReviewRequests = props => {
  const [requests, setRequests] = useState([]);

  const getReq = () => ({
    method: 'POST',
    body: JSON.stringify({
      token: localStorage.getItem('token')
    }),
    headers: {'Content-Type': 'application/json'}
  });

  useEffect(()=> {
    const internal = async () => {
      const req = getReq();
      const U = new URL(window.location.href);
      U.port=5000;
      U.pathname='/api/bingo/reviewRequests'
      const res = await fetch(U.href, req);
      const j = await res.json();
      const {error, requests} = j;
      if (error) {
        console.log('Something went wrong');
        console.log(error);
      } else {
        setRequests(requests);
      }
    }
    internal();
  }, []);

  const accept = async (id) => {
    const req = getReq();
    const U = new URL(window.location.href);
    U.port=5000;
    U.pathname=`/api/bingo/approveRequest/${id}`;
    const res = await fetch(U.href,req);
    const j = await res.json();
    if (j.error) {
      console.log('Something went wrong');
    } else {
      setRequests(requests.filter(req=>req.id!==id));
    }
  }

  const reject = async (id) => {
    const req = getReq();
    const U = new URL(window.location.href);
    U.port=5000;
    U.pathname=`/api/bingo/deleteRequest/${id}`;
    const res = await fetch(U.href, req);
    const j = await res.json();
    if (j.error) {
      console.log('Something went wrong:')
      console.log(j.error);
    } else {
      setRequests(requests.filter(req=>req.id!==id));
    }
  }

  return (
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
        {requests.map(req => {
          const {bingoName, id, promptText} = req;
          return (
            <tr key={id}>
              <td>{bingoName}</td>
              <td>{promptText}</td>
              <td><button type="button" onClick={()=>accept(id)}>Accept</button></td>
              <td><button type="button" onClick={()=>reject(id)}>Reject</button></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  )
};

export default ReviewRequests;
