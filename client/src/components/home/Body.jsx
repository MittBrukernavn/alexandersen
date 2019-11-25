import React from 'react';
import styled from 'styled-components';


const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  width: 90vw;
  max-width: 50em;
  min-height: 20em;
  background-color: white;
  margin: 0.5em auto;
  border-radius: 1em;
  padding: 0.5em;
`;

const Card = styled.div`
  margin: 0.5em;
  padding: 0.5em;
  border: 1px solid #eee;
  border-radius: 0.5em;
`;

const A = styled.a`
  color: #2dd;
  text-decoration: none;
`;

const pages = [
  {
    title: 'Binary christmas tree',
    href: '/christmastree',
    description: `For Online's christmas workshop, someone had the bright idea of making a christmas binary tree (i.e. a christmas tree and a binary tree).
      I thought it sounded fun, and decided to make it a reality. Enjoy.`
  },
  {
    title: 'Bingo',
    href: '/bingo',
    description: `My first project published on the website was an old bingo project, from a debate earlier this year.
      It has been expanded on slightly, allowing for some level of user generated content and with more bingo sets to play with.`
  }
];

const Body = props => (
  <Wrapper>
    {
      pages.map(({title, href, description}) => (
        <Card>
          <h2><A href={href}>{title}</A></h2>
          <p>{description}</p>
        </Card>
      ))
    }
  </Wrapper>
);

export default Body;
