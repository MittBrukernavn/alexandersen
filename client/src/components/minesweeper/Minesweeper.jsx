import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import MinesweeperTile from './MinesweeperTile';

const Wrapper = styled.div`
`;

const Table = styled.table`
  margin: auto;
`;

const Minesweeper = () => {
  const [initialized, setInitialized] = useState(false);
  const [board, setBoard] = useState([[]]);

  const clicked = (rowNumber, colNumber) => {
    const nextBoard = [...board];
    if (!initialized) {
      setInitialized(true);
      // set bombs in accordance to the first click
      const bombCount = 20;
      // generate all eligible bomb points
      const possiblePositions = [];
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (i !== rowNumber || j !== colNumber) {
            possiblePositions.push([i, j]);
          }
        }
      }

      // randomly shuffle
      for (let i = possiblePositions.length - 1; i > 0; i--) {
        const j = Math.floor((i + 1) * Math.random());
        const c = possiblePositions[i];
        possiblePositions[i] = possiblePositions[j];
        possiblePositions[j] = c;
      }

      // pick the first positions of the randomized list, and set them to be bombs
      for (let i = 0; i < bombCount; i++) {
        const [y, x] = possiblePositions[i];
        nextBoard[y][x].bomb = true;
        for (let m = -1; m <= 1; m++) {
          for (let n = -1; n <= 1; n++) {
            const ny = y + m;
            const nx = x + n;
            if (ny >= 0 && ny < nextBoard.length && nx >= 0 && nx < nextBoard[ny].length) {
              nextBoard[y + m][x + n].num++;
            }
          }
        }
      }
    }

    // expand automatically when no neighboring tiles are bombs
    const stack = [[rowNumber, colNumber]];
    while (stack.length) {
      const [y, x] = stack.pop();
      if (!nextBoard[y][x].checked) {
        nextBoard[y][x].checked = true;
        if (nextBoard[y][x].num === 0) {
          // push onto the stack
          for (let ny = y - 1; ny <= y + 1; ny++) {
            for (let nx = x - 1; nx <= x + 1; nx++) {
              if (ny >= 0 && ny < nextBoard.length && nx >= 0 && nx < nextBoard[ny].length) {
                stack.push([ny, nx]);
              }
            }
          }
        }
      }
    }
    setBoard(nextBoard);
  };

  useEffect(() => {
    const rowCount = 10;
    const colCount = 10;
    const newBoard = [];
    for (let i = 0; i < rowCount; i++) {
      const thisRow = [];
      for (let j = 0; j < colCount; j++) {
        thisRow.push({ bomb: false, checked: false, num: 0 });
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
              // using rownumber/colnumber for this purpose works, since it can't change in runtime
              // eslint-disable-next-line
              <tr key={rowNumber}>
                {row.map((tile, colNumber) => {
                  const { bomb, checked, num } = tile;
                  return (
                    <MinesweeperTile
                      // eslint-disable-next-line
                      key={colNumber}
                      bomb={bomb}
                      tested={checked}
                      num={num}
                      onClick={() => clicked(rowNumber, colNumber)}
                    />
                  );
                })}
              </tr>
            ))

          }
        </tbody>
      </Table>
    </Wrapper>
  );
};

export default Minesweeper;
