import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const BranchDiv = styled.div`
  flex: 1;
`;

const RecursiveDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

const Svg = styled.svg`
  flex: 1;
`;

const Branch = styled.polygon`
  fill: green;
`;

const Julekule = styled.circle`
  fill: red;
`;

const Tree = props => {
  const { depth, maxDepth } = props;
  return (
    <Wrapper>
      <BranchDiv>
        <Svg viewBox='0 0 100 100'>
        <Branch
          points={'50,0 0,100 100,100'}
        />
        <Julekule 
          cx={50} 
          cy={10} 
          r={10}
        />
        </Svg>
      </BranchDiv>
      
      {depth < maxDepth ? (
        <RecursiveDiv>
          <Tree depth={depth+1} maxDepth={maxDepth} />
          <Tree depth={depth+1} maxDepth={maxDepth} />
        </RecursiveDiv>
       ) : null}
    </Wrapper>
    
  );
}

export default Tree;
