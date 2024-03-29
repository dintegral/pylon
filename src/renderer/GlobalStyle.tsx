import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    -webkit-user-select: none;
    user-select: none;
    -webkit-app-region: drag;
  }

  button {
    -webkit-app-region: no-drag;
  }
`;
