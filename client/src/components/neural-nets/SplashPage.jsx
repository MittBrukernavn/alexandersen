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
    }
  ];

  return (
    <Wrapper>
      <h1>Did anyone say neural nets?</h1>
      <p>
        I play with some on this page.
        My current main project is a CNN for recognizing handwritten digits, using the MNIST dataset.
        It's not original, but it's easy to deal with for now. Maybe more soon? We will see.
      </p>
      {pages.map(({ title, href }) => <a href={`/nn/${href}`}>{title}</a>)}
    </Wrapper>
  );
};

export default SplashPage;
