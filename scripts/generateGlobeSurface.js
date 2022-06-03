import { globe } from "./globe.js";
import { state } from "./event-listeners.js";

const canvas = document.createElement("canvas");
const d3Canvas = d3.select(canvas).attr("width", "4096").attr("height", "2048");
const context = canvas.getContext("2d");
document.body.insertBefore(canvas, d3.select(".filters").node());

export function setNewData() {
  console.log("setting new configuration", state);

  // toDataURL(
  //     //"//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
  //     "./basemaps/white.png",
  //     function (base64Url) {
  //         console.log("RESULT:", { state, base64Url });
  //         globe.globeImageUrl(base64Url);
  //     }
  // );

  // const image = new Image();
  // image.src = "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg";
  // image.onload = () => {
  //     globe.globeImageUrl(image);
  // }
  // console.log('setting data', state)

  // globe.globeImageUrl(
  //     "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
  // )
  // It's on me to implement this function

  // Generating BASE 64 IMG

  // Updating Globe

  // Setting state extent ...

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
    const customColorInterpolator = d3
      .scaleLinear()
      .domain(state.chosenThemeArray.map((d, i, arr) => i / (arr.length - 1)))
      .range(state.chosenThemeArray);

    var data = new Array(/*65160 * 4 */ 65160).fill().map((d) => 0);

    const scale = d3
      .scaleLinear()
      .domain([
        d3.min(
          state.currentDataset.filter((d) => d.Value > 0.000001),
          (d) => d.Value
        ),
        d3.max(
          state.currentDataset.filter((d) => d.Value > 0.000001),
          (d) => d.Value
        ),
      ])
      .range([0, 1]);

    const normalizedProjectData = JSON.parse(
      JSON.stringify(state.currentDataset)
    );
    // var normalizedProjectData = state.currentDataset;
    normalizedProjectData.forEach((d) => {
      d.Value = scale(d.Value);
    });

    normalizedProjectData.forEach((d) => {
      var latLevel; //from 0 to 180
      var lonLevel; //from 0 to 359
      if (
        parseFloat(d.LON) - Math.floor(parseFloat(d.LON)) == 0 &&
        parseFloat(d.LAT) - Math.floor(parseFloat(d.LAT)) == 0.25
      ) {
        if (parseFloat(d.LAT) > 0) {
          latLevel = 90 - parseFloat(d.LAT);
        } else {
          latLevel = 90 + Math.abs(parseFloat(d.LAT));
        }
        if (parseFloat(d.LON) < 0) {
          lonLevel = 360 - Math.abs(parseFloat(d.LON));
        } else {
          lonLevel = parseFloat(d.LON);
        }
        let index = latLevel * 360 + lonLevel;
        data[index] = parseFloat(d.Value);
      }
    });

    const width = 4096;
    const height = 2048;

    const project = d3
      .geoEquirectangular()
      .precision(0.1)
      .fitSize([width, height], { type: "Sphere" })
      .translate([width / 2, height / 2]);

    let eachBarGroupWidth = 20;
    let eachBarHeight = 10;
    normalizedProjectData.forEach((item, i, arr) => {
      context.fillStyle = customColorInterpolator(item.Value);
      const pos = project([item.LON, item.LAT]);

      if (item.Value < -10) {
        context.fillStyle = "#000000";
      }

      context.fillRect(
        pos[0], // x
        pos[1], // y
        eachBarGroupWidth, // width
        eachBarHeight // height
      );
    });
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
