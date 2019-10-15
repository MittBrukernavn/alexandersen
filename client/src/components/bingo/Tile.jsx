import React from 'react';
import styled from 'styled-components';

const Tile = props => {
  const { data, columnIndex } = props;
  const { text, chosen } = data; 
  const Wrapper = styled.td`
    background-color: ${chosen ? 'green' : 'white'};
    border: 1px solid black;
    min-width: 8em;
    padding: 0.5em;
  `
  
  return (
    <Wrapper>
      {text}
    </Wrapper>
  )
}

export default Tile;
