import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import MinesweeperTile from './MinesweeperTile.jsx';

const Wrapper = styled.div`
`;

const Table = styled.table`
  margin: auto;
`;

const Minesweeper = (props) => {
  const [ initialized, setInitialized ] = useState(false);
  const [ board, setBoard ] = useState([[]]);

  const clicked = (rowNumber, colNumber) => {
    const nextBoard = [...board];
    if (!initialized) {
      setInitialized(true);
      // set bombs in accordance to the first click
      const bombCount = 20;
      // generate all eligible bomb points
      const possiblePositions = [];
      for(let i = 0; i < board.length; i++) {
        for(let j = 0; j < board[i].length; j++) {
          if (i !== rowNumber || j !== colNumber) {
            possiblePositions.push([i, j]);
          }
        }
      }
      // TODO: randomly shuffle
      
      // pick the first positions of the randomized list, and set them to be bombs
      for(let i = 0; i < bombCount; i++) {
        const [y, x] = possiblePositions[i];
        nextBoard[y][x].bomb = true;
        for(let m = -1; m <= 1; m++) {
          for(let n = -1; n <=1; n++) {
            const ny = y + m;
            const nx = x + n;
            if (ny >= 0 && ny < nextBoard.length && nx >= 0 && nx < nextBoard[ny].length) {
              nextBoard[y+m][x+n].num++;
            }
          }
        }
      }
      console.log('Initialized');
    }
    nextBoard[rowNumber][colNumber].checked = true;
    setBoard(nextBoard);
  };
  
  useEffect(()=>{
    const rowCount = 10;
    const colCount = 10;
    const newBoard = [];
    for(let i = 0; i < rowCount; i++) {
      const thisRow = [];
      for(let j = 0; j < colCount; j++) {
        thisRow.push({bomb: false, checked: false, num: 0});
      }
      newBoard.push(thisRow);
    }
    setBoard(newBoard);
  }, []);

  return (
    <Wrapper>
      <Table>
        <tbody>
          {
            board.map((row, rowNumber) => (
              <tr key={rowNumber}>
                {row.map((tile, colNumber) => {
                  const { bomb, checked, num } = tile;
                  return <MinesweeperTile key={colNumber} bomb={bomb} tested={checked} num={num} onClick={()=>clicked(rowNumber, colNumber)} />;
                })}
              </tr>
            ))

          }
        </tbody>
      </Table>
    </Wrapper>
  );
}

export default Minesweeper;
