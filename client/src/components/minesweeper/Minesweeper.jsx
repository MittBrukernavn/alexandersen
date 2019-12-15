import React, { useState } from 'react';
import styled from 'styled-components';

import MinesweeperTile from './MinesweeperTile.jsx';

const Wrapper = styled.div`

`;

const Minesweeper = (props) => {
  const [ initialized, setInitialized ] = useState(false);
  const [ board, setBoard ] = useState([[{bomb: false, checked: false}, {bomb: false, checked: false}], [{bomb: false, checked: false}, {bomb: false, checked: false}]]);

  const clicked = (rowNumber, colNumber) => {
    if (!initialized) {
      setInitialized(true);
      // set bombs

      console.log('Initialized');
    }
  };

  return (
    <table>
      <tbody>
        {
          board.map((row, rowNumber) => (
            <tr key={rowNumber}>
              {row.map((tile, colNumber) => {
                const { bomb, checked } = tile;
                return <MinesweeperTile key={colNumber} bomb={bomb} tested={checked} onClick={()=>clicked(rowNumber, colNumber)} />;
              })}
            </tr>
          ))

        }
      </tbody>
    </table>
  );
}

export default Minesweeper;
