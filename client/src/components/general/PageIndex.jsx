import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Body from './Body';

const Card = styled.div`
  margin: 0.5em;
  padding: 0.5em;
  border: 1px solid #eee;
  border-radius: 0.5em;
`;

const A = styled(Link)`
  color: #2dd;
  text-decoration: none;
`;

const PageIndex = ({ pages }) => (
  <Body>
    {pages.map(({ title, href, description }) => (
      <Card key={href}>
        <h2><A to={href}>{title}</A></h2>
        <p>{description}</p>
      </Card>
    ))}
  </Body>
);

PageIndex.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  })).isRequired,
};

export default PageIndex;
