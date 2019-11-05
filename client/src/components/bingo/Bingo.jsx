import React, { Component } from 'react';
import styled from 'styled-components';

import Row from './Row.jsx';

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

class Bingo extends Component {
  state = {
    index: 0,
    bingoTypes: [],
    rows: []
  }

  async componentDidMount() {
    const U = new URL(window.location.href);
    U.port=5000;
    U.pathname='/api/bingo/';
    const res = await fetch(U.href);
    const { bingos } = await res.json();
    this.setState({
      bingoTypes: bingos
    });
  }

  chooseBingo = async (e) => {
    const id = parseInt(e.target.value);
    this.setState({
      index: id
    });
    const U = new URL(window.location.href);
    U.port=5000;
    U.pathname=`/api/bingo/${id}`;
    const res = await fetch(U.href);
    const { rows } = await res.json();
    this.setState({
      rows
    });
  }

  toggleChosen = (row, col) => {
    const { rows } = this.state;
    rows[row][col].chosen = !rows[row][col].chosen;
    this.checkForBingo();
    this.setState({rows});
  }

  checkForBingo = () => {
    const { rows } = this.state;
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

  render() {
    const { rows, bingoTypes, index } = this.state;
    return (
      <div>
        <H1><select value={index} onChange={this.chooseBingo}>
            {index === 0 ? <option value={0}>Velg en</option> : null}
            {bingoTypes.map(({id, name}) => <option key={id} value={id}>{name}</option>)}
          </select>-bingo</H1>
        <Board>
          <tbody>
            {rows.map((row, index) => <Row key={index} data={row} rowIndex={index} toggle={this.toggleChosen} /> )}
          </tbody>
        </Board>
        
      </div>
    );
  }
}

export default Bingo;
