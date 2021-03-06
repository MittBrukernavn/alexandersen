import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AdminPanel = () => (
  <Wrapper>
    <h1>Welcome, mr.</h1>
    <ul>
      <a href="/admin/bingo"><li>Lag ny bingo</li></a>
      <a href="/admin/prompts"><li>Manage prompts</li></a>
      <a href="/admin/review"><li>Vurder forslag</li></a>
      <a href="/admin/dotmocracy"><li>Se dotmocracy-rom</li></a>
    </ul>
  </Wrapper>
);

export default AdminPanel;
