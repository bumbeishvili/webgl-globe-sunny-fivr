import { openLink } from "./event-listeners.js";

const globe = Globe()
  .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
  .onGlobeClick(openLink)
  .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")(
  document.getElementById("globeViz")
);

export { globe };
