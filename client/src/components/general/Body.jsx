import styled from 'styled-components';

const Body = styled.div`
  display: flex;
  flex-flow: column;
  width: 90vw;
  max-width: ${(props) => props.maxWidth || '50em'};
  min-height: 20em;
  background-color: white;
  margin: 0.5em auto;
  border-radius: 1em;
  padding: 0.5em;
`;

export default Body;
