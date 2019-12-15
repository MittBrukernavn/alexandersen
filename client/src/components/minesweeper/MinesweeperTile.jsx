import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.td`
  width: 2em;
  height: 2em;
  border: 2px solid black;
  background-color: ${props => props.tested ? 'blue' : 'white' };
  ${props => props.bomb && props.tested ? 'background-color: red;' : null}
`;

const MinesweeperTile = props => {
  const { tested, bomb, onClick } = props;

  return <Wrapper tested={tested} bomb={bomb} onClick={onClick} />;
}

export default MinesweeperTile;
