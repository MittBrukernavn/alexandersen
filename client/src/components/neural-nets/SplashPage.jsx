import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 0 0.5em;
`;


const SplashPage = () => {
  const pages = [
    {
      title: 'MNIST',
      href: 'mnist',
    },
  ];

  return (
    <Wrapper>
      <h1>Did anyone say neural nets?</h1>
      <p>
        I play with some on this page.
      </p>
      {pages.map(({ title, href }) => <a href={`/nn/${href}`}>{title}</a>)}
    </Wrapper>
  );
};

export default SplashPage;
