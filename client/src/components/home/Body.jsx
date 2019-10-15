import React from 'react';
import styled from 'styled-components';


const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  width: 90vw;
  max-width: 50em;
  min-height: 20em;
  background-color: white;
  margin: auto;
`;

const Body = props => (
  <Wrapper>
    <h2>Bingo</h2>
    <p>
      My first project published on the website was an old bingo project, from a debate earlier this year.
      It can be found <a href='/bingo'>here</a>. I intend to expand on it later, 
      probably allowing for user generated inputs and more sets to play with.
    </p>
  </Wrapper>
);

export default Body;
