import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { injectSpeedInsights } from '@vercel/speed-insights';

//export so build can import these images
export var BASE_IMAGE_L1 = "/skateparks/skate-park-l1.jpeg";
export var BASE_IMAGE_L2 = "/skateparks/skate-park-l2.jpeg";
export var BASE_IMAGE_L3 = "/skateparks/skate-park-l3.jpeg";
export var BASE_IMAGE_L4 = "/skateparks/skate-park-l4.jpeg";
export var BASE_IMAGE_L5 = "/skateparks/skate-park-l5.jpeg";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);

injectSpeedInsights();

