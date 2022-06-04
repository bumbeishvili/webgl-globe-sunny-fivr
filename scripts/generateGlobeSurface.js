import { globe } from "./globe.js";
import { state } from "./event-listeners.js";
import { data as dataInitial } from "./main.js";

const canvas = document.createElement("canvas");
const d3Canvas = d3.select(canvas).attr("width", "4096").attr("height", "2048");
const context = canvas.getContext("2d");
context.imageSmoothingEnabled = false;
// document.body.insertBefore(canvas, d3.select(".filters").node());

export function setNewData() {
  function make_base(imageUrl) {
    const base_image = new Image();
    base_image.src = imageUrl;
    base_image.onload = function () {
      context.drawImage(base_image, 0, 0);

      // Download data and then
      {
        drawData();
        addCanvasToGlobe();
      }
    };
  }

  make_base("./basemaps/" + state.chosenBaseMap);
  // make_base('./basemaps/white.png')

  function addCanvasToGlobe() {
    const base64Img = canvas.toDataURL("image/jpeg");
    globe.globeImageUrl(base64Img);
  }

  function drawData() {
    const domainMin = d3.min(
      state.currentDataset.filter((d) => !d.anomaly),
      (d) => d.Value
    );

    const domainMax = d3.max(
      state.currentDataset.filter((d) => !d.anomaly),
      (d) => d.Value
    )

    const color = d3.scaleLinear()
      .domain(state.chosenThemeArray.map((d, i, arr) => {
        return domainMin + (domainMax - domainMin) * i / (arr.length - 1);
      }))
      .range(state.chosenThemeArray);


    const width = 4096;
    const height = 2048;

    const offsets = {
      "default": {
        dimensionOffset: 12,
        translateXOffset: 0,
        translateYOffset: 0,
      },
      "fill": {
        dimensionOffset: 60,
        translateXOffset: -10,
        translateYOffset: -60,
      }
    }



    const offsetType = "default";
    const dimensionOffset = offsets[offsetType]['dimensionOffset'];
    const translateXOffset = offsets[offsetType]['translateXOffset'];
    const translateYOffset = offsets[offsetType]['translateYOffset'];

    const project = d3
      .geoEquirectangular()
      .precision(1.01)
      .fitSize([width + dimensionOffset, height + dimensionOffset], { type: "Sphere" })
      .translate([width / 2 - translateXOffset, height / 2 - translateYOffset]);

    let eachBarGroupWidth = 20;
    let eachBarHeight = 10;

    state.currentDataset.forEach((item, i, arr) => {
      context.fillStyle = color(item.Value);
      const pos = project([item.LON, item.LAT]) //.map(Math.round);
      context.globalAlpha = 1;
      if (item.anomaly) {
        // Don't draw
        // console.log('anomaly')

      } else {
        context.fillRect(
          pos[0], // x
          pos[1], // y
          eachBarGroupWidth, // width
          eachBarHeight // height
        );
      }



    });



    const mapDataObj = dataInitial.mapData.filter(d => d.dataFile === state.chosenDataFile)[0];
    if (+mapDataObj.fillGap) {
      const imageData = context.getImageData(12, 91, 12, 1956);
      context.putImageData(imageData, 0, 91);
      const imageDataTop = context.getImageData(0, 92, 1024, 10);
      for (let i = 0; i <= 9; i++) {
        context.putImageData(imageDataTop, 0, i * 10);
        context.putImageData(imageDataTop, 512 * 1, i * 10);
        context.putImageData(imageDataTop, 512 * 2, i * 10);
        context.putImageData(imageDataTop, 512 * 3, i * 10);
        context.putImageData(imageDataTop, 512 * 4, i * 10);
        context.putImageData(imageDataTop, 512 * 5, i * 10);
        context.putImageData(imageDataTop, 512 * 6, i * 10);
        context.putImageData(imageDataTop, 512 * 7, i * 10);
      }
    }
  }
}

function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    var reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.send();
}
