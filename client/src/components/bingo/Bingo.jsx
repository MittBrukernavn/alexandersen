import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Row from './Row.jsx';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const H1 = styled.h1`
  text-align: center;
  font-size: 1.5em;
  font-family: sans-serif;
  & select {
    font-size: 1.2em;
    margin: 0;
    height: 100%;
  }
`;

const Board = styled.table`
  margin: auto;
  border: 1px solid black;
  word-wrap: break-word;
  border-collapse: collapse;
  min-height: 75vh;
`;

const Bingo = props => {
  const [index, setIndex] = useState(0);
  const [bingoTypes, setBingoTypes] = useState([]);
  const [rows, setRows] = useState([]);
  const [description, setDescription] = useState('');
  const [konamiCount, setKonamiCount] = useState(0);

  const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];


  useEffect(()=>{
    const internal = async () => {
      const U = new URL(window.location.href);
      U.port=5000;
      U.pathname='/api/bingo/';
      const res = await fetch(U.href);
      const { bingos } = await res.json();
      setBingoTypes(bingos);
    }
    internal();
  }, [])

  useEffect(() => {
    // konami code easter egg
    const keyDownHandler = event => {
      const { keyCode } = event;
      if (konamiCount === konami.length) {
        // already completed
        return;
      }
      if (keyCode === konami[konamiCount]) {
        const newIndex = konamiCount + 1;
        if(newIndex < konami.length) {
          // code not completed
          setKonamiCount(newIndex);
        } else {
          // code completed, set all the bingos
          const rowsCopy = [...rows]
          rowsCopy.forEach(row => row.forEach(b=>{
            b.chosen=true;
            b.bingo=true;
          }));
          setRows(rowsCopy);
        }
      } else {
        setKonamiCount(0);
      }
    }
    window.addEventListener('keydown', keyDownHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
    }
  }, [konami, konamiCount, rows])

  const chooseBingo = async (e) => {
    const id = parseInt(e.target.value);
    setIndex(id);
    const U = new URL(window.location.href);
    U.port=5000;
    U.pathname=`/api/bingo/${id}`;
    const res = await fetch(U.href);
    const { rows, description } = await res.json();
    setRows(rows);
    setDescription(description);
  }

  const checkForBingo = (rows) => {
    for(let i = 0; i < rows.length; i++) {
      const rowBingo = rows[i].reduce((current,next)=>current&&next.chosen, true);
      rows[i].forEach(b=>b.bingo=rowBingo);
    }
    for(let j = 0; j < rows[0].length; j++) {
      let colBingo=true;
      for(let i = 0; i < rows.length; i++) {
        if (!rows[i][j].chosen) {
          colBingo=false;
          break;
        }
      }
      if(colBingo) {
        for(let i = 0; i < rows.length; i++) {
          rows[i][j].bingo=true;
        }
      }
    }

    // diagonal 1
    let diag1 = true;
    let diag2 = true;
    for(let i = 0; i < rows.length; i++) {
      if(!rows[i][i].chosen) {
        diag1 = false;
      }
      const j = rows[i].length - 1 - i;
      if(!rows[i][j].chosen) {
        diag2 = false;
      }
    }
    if (diag1) {
      for (let i = 0; i < rows.length; i++) {
        rows[i][i].bingo=true;
      }
    }
    if (diag2) {
      for (let i = 0; i < rows.length; i++) {
        const j = rows[i].length - 1 - i;
        rows[i][j].bingo=true;
      }
    }
  }

  const toggleChosen = (row, col) => {
    const rows_copy = [...rows];
    rows_copy[row][col].chosen = !rows[row][col].chosen;
    checkForBingo(rows_copy);
    setRows(rows_copy);
  }

  return (
    <Wrapper>
      <H1><select value={index} onChange={chooseBingo}>
          {index === 0 ? <option value={0}>Velg en</option> : null}
          {bingoTypes.map(({id, name}) => <option key={id} value={id}>{name}</option>)}
        </select>-bingo</H1>
        <p>{description}</p>
      <Board>
        <tbody>
          {rows.map((row, index) => <Row key={index} data={row} rowIndex={index} toggle={toggleChosen} /> )}
        </tbody>
      </Board>
      <p>Har du lyst til å legge til flere felt til bingoen, kan du gjøre det <a href='/bingo/request'>her</a>
      </p>
    </Wrapper>
  );
};

export default Bingo;
