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

const Julestjerne = (
  <svg x={35} y={0} width={30} height={30} viewBox="0 0 167 167" >
    <g transform="matrix(1,0,0,1,-1065.04,-69.01)">
      <g transform="matrix(0.470077,0,0,1,531.77,0)">
          <g transform="matrix(2.83642,0,0,1.33333,914.268,-277.944)">
              <g transform="matrix(1,0,0,1,171.299,370.231)">
                  <path d="M0,-101.72L-28.406,-59.668L-0.497,-59.312L-54.946,10.118L-33.175,-45.879L-60.813,-45.95L-29.288,-110.015C-29.288,-110.015 -21.027,-109.785 -13.921,-107.785C-6.834,-105.79 0,-101.72 0,-101.72Z"
                  style={{fill:'rgb(250,183,89)',fillRule:'nonzero'}}/>
              </g>
              <g transform="matrix(0.75,0,0,0.75,0,186.709)">
                  <path d="M236.622,114.629C239.737,116.969 242.712,119.544 245.548,122.352C253.395,130.276 259.416,139.289 263.611,149.388C267.807,159.488 269.904,170.093 269.904,181.203C269.904,192.313 267.807,202.898 263.611,212.959C259.416,223.02 253.395,232.013 245.548,239.937C237.624,247.862 228.612,253.922 218.512,258.117C208.412,262.312 197.807,264.41 186.697,264.41C179.342,264.41 172.217,263.491 165.322,261.652L185.836,235.386C186.123,235.39 186.41,235.392 186.697,235.392C196.719,235.392 205.829,232.945 214.025,228.051C222.222,223.156 228.767,216.611 233.662,208.414C238.556,200.218 241.003,191.147 241.003,181.203C241.003,171.181 238.556,162.071 233.662,153.875C230.11,147.928 225.69,142.85 220.401,138.642L236.622,114.629ZM178.079,98.428L160.843,133.456C160.388,133.709 159.936,133.97 159.486,134.239C151.29,139.133 144.744,145.679 139.85,153.875C134.955,162.071 132.508,171.181 132.508,181.203C132.508,191.147 134.955,200.218 139.85,208.414C144.337,215.929 150.213,222.057 157.477,226.796L147.204,254.408C140.211,250.596 133.797,245.772 127.963,239.937C120.038,232.013 113.979,223.02 109.783,212.959C105.588,202.898 103.49,192.313 103.49,181.203C103.49,170.093 105.588,159.488 109.783,149.388C113.979,139.289 120.038,130.276 127.963,122.352C135.887,114.505 144.88,108.484 154.941,104.289C162.368,101.192 170.081,99.238 178.079,98.428Z"
                  style={{fill:'rgb(11,83,116)',fillRule:'nonzero'}}/>
              </g>
          </g>
      </g>
    </g>
  </svg>
);

const Julekule = styled.circle`
  fill: red;
`;

const Tree = props => {
  const { depth, nodeCount } = props;
  const childNodes = nodeCount - 1;
  const leftCount = Math.ceil(childNodes/2);
  const rightCount = Math.floor(childNodes/2);
  return (
    <Wrapper>
      <BranchDiv>
        <Svg viewBox='0 0 100 100'>
        <Branch
          points={depth === 1 ? '50,15 0,100 100,100' : '50,0 0,100 100,100'}
        />
        {depth === 1 ? Julestjerne : (
          <Julekule 
            cx={50} 
            cy={10} 
            r={10}
          />
        )}
        </Svg>
      </BranchDiv>
      
      {leftCount > 0 ? (
        <RecursiveDiv>
          <Tree depth={depth+1} nodeCount={leftCount} />
          { rightCount > 0 ? <Tree depth={depth+1} nodeCount={rightCount} /> : <Wrapper />}
        </RecursiveDiv>
       ) : null}
    </Wrapper>
    
  );
}

export default Tree;
