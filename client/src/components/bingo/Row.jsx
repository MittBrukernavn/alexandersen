import React from 'react';

import Tile from './Tile.jsx';

const Row = props => {
  const { data, rowIndex, toggle } = props;
  return (
    <tr>
      {data.map((tile, columnIndex) => <Tile key={columnIndex} data={tile} rowIndex={rowIndex} columnIndex={columnIndex} toggle={toggle} />)}
    </tr>
  );
}

export default Row;
