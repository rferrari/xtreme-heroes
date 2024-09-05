import { createGlobalStyle, css } from "styled-components";

export default createGlobalStyle`${css`
  :root {
    font-size: 62.5%;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body {
    width: 100%;
    height: 100%;
    overflow: hidden; /* Prevents scrolling on the entire page */
  }

  #root {
    position: relative;
    width: 100%;
    height: 100vh;

    font-size: 1.6rem;
    font-weight: 400;
    font-family: "Roboto", sans-serif;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;

    overflow: hidden; /* Prevents scrolling within #root */

    /* Set the background image */
    background-size: cover; /* Stretches the background to cover the entire area */
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed; /* Keeps the background fixed while scrolling */
    background-image: url("/skateparks/skate-park-l1.jpeg"); /* Background image */
  }

  #root::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9); /* Semi-transparent black overlay */
    z-index: 1; /* Ensures overlay is above the background image */
  }

  #root > * {
    position: relative;
    z-index: 2; /* Ensures content is above the overlay */
    height: 100%; /* Ensure content fills the height of #root */
    overflow: hidden; /* Prevents any internal scrolling within the content */
  }

  button {
    border: none;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  button:disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  a {
    font-weight: 500;
    text-decoration: inherit;
  }
`}`;
