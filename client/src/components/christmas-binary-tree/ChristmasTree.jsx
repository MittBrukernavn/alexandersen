import React, { useState } from 'react';
import styled from 'styled-components';

import Tree from './Tree.jsx';

const Wrapper = styled.div`
  max-width: 60em;
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
  const [maxDepth, setMaxDepth] = useState(3);

  return (
    <Wrapper>
      <InputField>
        <label htmlFor='maxDepthIn' >
          How many layers? <input id='maxDepthIn' value={maxDepth} onChange={e=>setMaxDepth(e.target.value)} />
        </label>
      </InputField>
      <Tree depth={1} maxDepth={maxDepth} />
    </Wrapper>
  );
}

export default ChristmasTree;