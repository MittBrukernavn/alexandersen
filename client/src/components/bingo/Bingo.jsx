import React, { Component } from 'react';
import styled from 'styled-components';

import Row from './Row.jsx';

const H1 = styled.h1`
  margin: auto;
`;

const Board = styled.table`
  margin: auto;
  border: 1px solid black;
  word-wrap: break-word;
  border-collapse: collapse;
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

  componentDidMount() {
    const { allPrompts, freeSpace } = this.state;
    // Fisher-yates shuffle
    for(let i = allPrompts.length - 1; i >= 0; i--) {
      let j = Math.floor(Math.random()*(i+1));
      let c = allPrompts[i];
      allPrompts[i] = allPrompts[j];
      allPrompts[j] = c;
    }
    const rows = [];
    for(let i = 0; i < 5; i++) {
      const row = [];
      for(let j = 0; j < 5; j++) {
        row.push({
          text: allPrompts[5*i + j],
          chosen: false
        });
      }
      rows.push(row);
    }
    rows[2][2] = {
      text: freeSpace,
      chosen: true
    };
    this.setState({
      rows
    });
  }

  render() {
    const { rows } = this.state;
    return (
      <div>
        <h1>Partileder?-bingo</h1>
        <Board>
          <tbody>
            {rows.map((row, index) => <Row key={index} data={row} rowIndex={index} /> )}
          </tbody>
        </Board>
        
      </div>
    );
  }
}

export default Bingo;
