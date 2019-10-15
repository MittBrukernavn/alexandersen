import React from 'react';
import styled from 'styled-components';

const Tile = props => {
  const { data, toggle, rowIndex, columnIndex } = props
  const { text, chosen } = data; 
  const Wrapper = styled.td`
    background-color: ${chosen ? 'green' : 'white'};
    border: 1px solid black;
    min-width: 8em;
    padding: 0.5em;
  `
  
  return (
    <Wrapper onClick={() => toggle(rowIndex, columnIndex)}>
      {text}
    </Wrapper>
  )
}

export default Tile;
