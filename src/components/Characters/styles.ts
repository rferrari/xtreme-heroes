import styled from "styled-components";

export const Container = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

interface Character {
  image: string;
}

export const Character = styled.div<Character>`
  height: 12rem;
  border: 1px solid ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.blue_700};  
  background-size: 300%;
  background-position: 75% top;
  background-image: ${({ image }) => `url(${image})`};

  button {
    width: 100%;
    height: 100%;
    background: transparent;
    /* cursor: not-allowed; */
  }
  /* img {
    width: 150%;
  } */
`;
