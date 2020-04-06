import React from 'react';
import styled from 'styled-components';
import katex from 'katex';
import PropTypes from 'prop-types';

const Tile = ({
  data, toggle, rowIndex, columnIndex,
}) => {
  const { text, chosen, bingo } = data;
  const Wrapper = styled.td`
    ${chosen ? `background-color: ${bingo ? '#0000ff' : '#00ff00'};` : ''}
    ${bingo ? 'color: #fff;' : ''}
    border: 1px solid black;
    min-width: 3em;
    max-width: 15vw;
    padding: 0.5em;
    text-align: center;
    font-size: 1em;
    & span.katex-mathml {
      display: none;
    }
  `;

  if (/^\$\$.*\$\$$/.test(text)) {
    const katexString = katex.renderToString(text.substring(2, text.length - 2), {
      throwOnError: false,
    });
    return (
      <Wrapper
        onClick={() => toggle(rowIndex, columnIndex)}
        dangerouslySetInnerHTML={{ __html: katexString }}
      />
    );
  } if (text.indexOf('$') !== -1) {
    let count = 0;
    for (let i = 0; i < text.length; i++) {
      count += text[i] === '$';
    }
    if (count % 2 === 0) {
      const texts = text.split('$');
      return (
        <Wrapper onClick={() => toggle(rowIndex, columnIndex)}>
          {texts.map((t, i) => (i % 2
            ? (
              <span
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={
                  { __html: katex.renderToString(t, { throwOnError: false }) }
                }
              />
            // eslint-disable-next-line react/no-array-index-key
            ) : <span key={i}>{t}</span>))}
        </Wrapper>
      );
    }
  }
  return (
    <Wrapper onClick={() => toggle(rowIndex, columnIndex)}>
      {text}
    </Wrapper>
  );
};

Tile.propTypes = {
  data: PropTypes.shape({
    text: PropTypes.string.isRequired,
    chosen: PropTypes.bool.isRequired,
    bingo: PropTypes.bool.isRequired,
  }).isRequired,
  toggle: PropTypes.func.isRequired,
  rowIndex: PropTypes.number.isRequired,
  columnIndex: PropTypes.number.isRequired,
};

export default Tile;
