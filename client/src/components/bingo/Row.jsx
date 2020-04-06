import React from 'react';
import PropTypes from 'prop-types';

import Tile from './Tile';

const Row = ({ data, rowIndex, toggle }) => (
  <tr>
    {data.map((tile, columnIndex) => (
      <Tile
        // eslint-disable-next-line
        key={columnIndex}
        data={tile}
        rowIndex={rowIndex}
        columnIndex={columnIndex}
        toggle={toggle}
      />
    ))}
  </tr>
);

Row.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    chosen: PropTypes.bool.isRequired,
    bingo: PropTypes.bool.isRequired,
  })).isRequired,
  rowIndex: PropTypes.number.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Row;
