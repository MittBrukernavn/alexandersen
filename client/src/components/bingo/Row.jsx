import React from 'react';
import styled from 'styled-components';

import Tile from './Tile.jsx';

const Row = props => {
  const { data, rowIndex } = props;
  const Wrap = styled.tr`
    min-height: 8em;
  `;
  return (
    <Wrap>
      {data.map((tile, columnIndex) => <Tile key={columnIndex} data={tile} columnIndex={columnIndex} />)}
    </Wrap>
  );
}

export default Row;
