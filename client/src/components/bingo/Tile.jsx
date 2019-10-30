import React from 'react';
import styled from 'styled-components';
import katex from 'katex';

const Tile = props => {
  const { data, toggle, rowIndex, columnIndex } = props
  const { text, chosen } = data; 
  const Wrapper = styled.td`
    background-color: ${chosen ? '#00ff00' : '#ffffff'};
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
    const katex_string = katex.renderToString(text.substring(2,text.length-2), {
      throwOnError: false
      });
    return <Wrapper 
      onClick={() => toggle(rowIndex, columnIndex)}
      dangerouslySetInnerHTML={{__html: katex_string}}
    />;
  } else {
    return <Wrapper onClick={() => toggle(rowIndex, columnIndex)}>
      {text}
    </Wrapper>
  }
}

export default Tile;
