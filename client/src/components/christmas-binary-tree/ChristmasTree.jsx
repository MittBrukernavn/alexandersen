import React, { useState } from 'react';
import styled from 'styled-components';

import Tree from './Tree.jsx';

const Wrapper = styled.div`
  max-width: 80vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
`;

const InputField = styled.div`
  flex: 0;
  display: flex;
  flex-flow: row wrap;
`;

const ChristmasTree = () => {
  const [nodeCount, setNodeCount] = useState(3);

  return (
    <Wrapper>
      <InputField>
        <label htmlFor='nodeCountIn' >
          How many nodes? <input id='nodeCountIn' value={nodeCount} onChange={e=>setNodeCount(e.target.value)} />
        </label>
      </InputField>
      {nodeCount > 0 ? <Tree depth={1} nodeCount={nodeCount} /> : null}
    </Wrapper>
  );
}

export default ChristmasTree;