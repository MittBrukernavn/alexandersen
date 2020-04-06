import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Wrapper = styled.td`
  width: 2em;
  height: 2em;
  border: 2px solid black;
  background-color: ${(props) => (props.tested ? 'cyan' : 'white')};
  ${(props) => (props.bomb && props.tested ? 'background-color: red;' : null)}
`;

const MinesweeperTile = (props) => {
  const {
    tested, bomb, num, onClick,
  } = props;
  return (
    <Wrapper tested={tested} bomb={bomb} onClick={onClick}>
      {tested && !bomb && num > 0 ? num : null }
    </Wrapper>
  );
};

MinesweeperTile.propTypes = {
  tested: PropTypes.bool.isRequired,
  bomb: PropTypes.bool.isRequired,
  num: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MinesweeperTile;
