import React from 'react';
import styled from 'styled-components';
import katex from 'katex';

const Tile = props => {
  const { data, toggle, rowIndex, columnIndex } = props;
  const { text, chosen, bingo } = data; 
  const Wrapper = styled.td`
    ${chosen ? `background-color: ${bingo ? '#0000ff' : '#00ff00'};` : ''}
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
  } else if(text.indexOf('$')!==-1) {
    let count = 0;
    for(let i=0; i<text.length; i++) {
      count+=text[i]==='$'
    }
    if(count%2===0) {
      const texts = text.split('$');
      return (
        <Wrapper onClick={() => toggle(rowIndex, columnIndex)}>
          {texts.map((t,i)=> i%2 ? <span key={i} dangerouslySetInnerHTML={{__html:katex.renderToString(t,{throwOnError: false})}} />:<span key={i}>{t}</span>)}
        </Wrapper>
      )
    }
  }
  return <Wrapper onClick={() => toggle(rowIndex, columnIndex)}>
    {text}
  </Wrapper>
}

export default Tile;
