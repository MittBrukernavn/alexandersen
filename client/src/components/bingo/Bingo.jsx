import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Background from '../general/Background';
import Body from '../general/Body';
import Row from './Row';

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

const Bingo = () => {
  const [bingoId, setBingoId] = useState(0);
  const [bingoTypes, setBingoTypes] = useState([]);
  const [rows, setRows] = useState([]);
  const [description, setDescription] = useState('');
  const [konamiCount, setKonamiCount] = useState(0);

  const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

  useEffect(() => {
    const internal = async () => {
      const res = await fetch('/api/bingo/');
      const { bingos } = await res.json();
      setBingoTypes(bingos);
    };
    internal();
  }, []);

  useEffect(() => {
    // konami code easter egg
    const keyDownHandler = (event) => {
      const { keyCode } = event;
      if (konamiCount === konami.length) {
        // already completed
        return;
      }
      if (keyCode === konami[konamiCount]) {
        const newIndex = konamiCount + 1;
        if (newIndex < konami.length) {
          // code not completed
          setKonamiCount(newIndex);
        } else {
          // code completed, set all the bingos
          const rowsCopy = rows.map((cols) => (
            cols.map(((obj) => ({ ...obj, chosen: true, bingo: true })))
          ));
          setRows(rowsCopy);
        }
      } else {
        setKonamiCount(0);
      }
    };
    window.addEventListener('keydown', keyDownHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, [konami, konamiCount, rows]);

  const chooseBingo = async (e) => {
    const id = parseInt(e.target.value, 10);
    setBingoId(id);
    const res = await fetch(`/api/bingo/${id}`);
    const {
      rows: receivedRows,
      description: receivedDescription,
    } = await res.json();
    setRows(receivedRows);
    setDescription(receivedDescription);
  };

  const checkForBingo = (rowsParam) => {
    const r = rowsParam.map((cols) => (
      cols.map((obj) => ({ ...obj }))
    ));
    for (let i = 0; i < r.length; i++) {
      const rowBingo = r[i].reduce((current, next) => current && next.chosen, true);
      for (let j = 0; j < r[i].length; j++) {
        r[i][j].bingo = rowBingo;
      }
    }
    for (let j = 0; j < r[0].length; j++) {
      let colBingo = true;
      for (let i = 0; i < r.length; i++) {
        if (!r[i][j].chosen) {
          colBingo = false;
          break;
        }
      }
      if (colBingo) {
        for (let i = 0; i < r.length; i++) {
          r[i][j].bingo = true;
        }
      }
    }

    // diagonal 1
    let diag1 = true;
    let diag2 = true;
    for (let i = 0; i < r.length; i++) {
      if (!r[i][i].chosen) {
        diag1 = false;
      }
      const j = r[i].length - 1 - i;
      if (!r[i][j].chosen) {
        diag2 = false;
      }
    }
    if (diag1) {
      for (let i = 0; i < r.length; i++) {
        r[i][i].bingo = true;
      }
    }
    if (diag2) {
      for (let i = 0; i < r.length; i++) {
        const j = r[i].length - 1 - i;
        r[i][j].bingo = true;
      }
    }
    return r;
  };

  const toggleChosen = (row, col) => {
    const rowsCopy = [...rows];
    rowsCopy[row][col].chosen = !rows[row][col].chosen;
    setRows(checkForBingo(rowsCopy));
  };

  return (
    <Background>
      <H1>
        <select value={bingoId} onChange={chooseBingo}>
          {bingoId === 0 ? <option value={0}>Velg en</option> : null}
          {bingoTypes.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
        </select>
        -bingo
      </H1>
      <p>{description}</p>
      <Body>
        <Board>
          <tbody>
            {rows.map((row, rowNumber) => (
              // eslint-disable-next-line
              <Row key={rowNumber} data={row} rowIndex={rowNumber} toggle={toggleChosen} />
            ))}
          </tbody>
        </Board>
        <p>
          Har du lyst til å legge til flere felt til bingoen, kan du gjøre det
          <a href="/bingo/request">her</a>
        </p>
      </Body>
    </Background>
  );
};

export default Bingo;
