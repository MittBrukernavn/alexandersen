import React, { Component } from 'react';
import styled from 'styled-components';

import Row from './Row.jsx';

const H1 = styled.h1`
  text-align: center;
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
    rows: [],
    allPrompts: [
      'Moxnes prøver å få en kommentar/et innlegg',
      'Partileder nevner navn på partiet sitt',
      '"Studenter"',
      '"Det grønne skiftet"',
      '"Jeg vil bare ha det sagt"',
      'Svarer ikke på spørsmålet',
      'Siv Jensen drikker vann',
      'AP går over tiden',
      'Venstre nevner noe radikalt',
      'Whataboutism',
      'Jubel fra salen etter et utspill',
      'Fredrik Solvang får noen til å si noe de ikke ville',
      'Kraftuttrykk ("Søren" e.l.)',
      'Kommunesammenslåing',
      'Metrobussen',
      'Skolemat',
      'Sentralisering',
      'Fornavn',
      'Buing fra salen',
      'Verdensnyheter blir nevnt',
      '"MEN..."',
      'Gløshaugen',
      'Pandering',
      'Avsporing',
      'Vi i partiet mener at...',
      'Venstre nevner pelsdyrnæringen',
      'Skattelette til de rikeste',
      'Bestemor på anbud',
      'MDG blander inn klima i noe helt urelatert',
      'AP/FrP sier at de er miljøpartier',
      'Jonas banner',
      'Noen danser med en panda',
      'Velferdsprofitører'
    ],
    freeSpace: 'Noen lyver'
  }

  async componentDidMount() {
    const req = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const res = await fetch('/api/bingo/1', req);
    const { rows } = await res.json();

    this.setState({
      rows
    });

  }

  toggleChosen = (row, col) => {
    const { rows } = this.state;
    rows[row][col].chosen = !rows[row][col].chosen;
    this.setState({rows})
  }

  render() {
    const { rows } = this.state;
    return (
      <div>
        <H1>Partileder?-bingo</H1>
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
