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
    <h2><a href='/christmastree'>Binary christmas tree</a></h2>
    <p>
      For Online's christmas workshop, someone had the bright idea of making a christmas binary tree 
      (i.e. a christmas tree and a binary tree). I thought it sounded fun, and decided to make it a reality. Enjoy.
    </p>
    <h2><a href='/bingo'>Bingo</a></h2>
    <p>
      My first project published on the website was an old bingo project, from a debate earlier this year.
      It has been expanded on slightly, allowing for some level of user generated content and with more bingo sets to play with.
    </p>
  </Wrapper>
);

export default Body;
