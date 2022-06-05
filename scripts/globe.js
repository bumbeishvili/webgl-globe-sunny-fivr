import { openLink } from "./event-listeners.js";

const globe = Globe()
  .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
  .onGlobeClick(openLink)
  .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")(
    document.getElementById("globeViz")
  );

initDisplacement()
initControls();

function initDisplacement() {
  const material = globe.globeMaterial();

  const displacementTexture = new THREE.TextureLoader().load(
    //"./data/topo.png",
    "//unpkg.com/three-globe/example/img/earth-topology.png",
  );
  material.displacementMap = displacementTexture;
}



function initControls() {
  const controls = globe.controls();
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1;

  // stop autorotate after the first interaction
  controls.addEventListener("start", function () {
    controls.autoRotate = false;
  });
}

export { globe };
