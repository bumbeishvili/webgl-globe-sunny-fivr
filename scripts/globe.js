import { openLink } from "./event-listeners.js";

const globe = Globe()
  .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
  .onGlobeClick(openLink)
  .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")(
    document.getElementById("globeViz")
  );

initDisplacement()

function initDisplacement() {
  const material = globe.globeMaterial();

  const displacementTexture = new THREE.TextureLoader().load(
    //"./data/topo.png",
    "//unpkg.com/three-globe/example/img/earth-topology.png",
  );
  material.displacementMap = displacementTexture;
}

export { globe };
