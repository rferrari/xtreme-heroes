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


#aioha-modal .text-lg {
}

@media only screen and (min-width: 768px) {
  .tip_screen_message {
    display:none;
  }
}

@media only screen and (max-width: 768px) {
  .tip_screen_message {
      margin-top:1em;
      z-index:100;
  } 

  .tip_screen_message p {
    font-family: Arial, sans-serif;
    display:block;
    color:yellow;
    font-weight: 600;
    text-align: center;
    text-shadow: 0 0 black;
  }
}

// Add styles to your file:
.slider {
  -webkit-appearance: slider;
  width: 100%;
  height: 20px;
  background: rgba(0,0,0,.5);
  border-radius: 10px;
  outline: none;
  opacity: 0.7;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}

.slider::-ms-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}

`}`;
