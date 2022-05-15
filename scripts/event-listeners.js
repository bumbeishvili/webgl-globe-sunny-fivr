import { data } from "./main.js";
import { globe } from "./globe.js";
import { Legend } from "./legend.d3.js";

const state = {
  chosenDataFile: null,
  chosenTheme: null,
  chosenBaseMap: null,
  dataExtent: [0, 100],
  currentDataset: null,
};

document.addEventListener("data-loaded", ({ detail }) => {
  populateDropDowns(detail);
  loadAndProcessGlobeData();
});

document.addEventListener("local-selects-changed", (changedData) => {
  updateView();
});

d3.select(".data-select").on("change", () => {
  const chosenDataFile = d3.select(".data-select").node().value;
  state.chosenDataFile = chosenDataFile;
  loadAndProcessGlobeData();
});

d3.select(".theme-select").on("change", () => {
  state.chosenTheme = d3.select(".theme-select").node().value;
  updateView();
});

d3.select(".base-map-select").on("change", () => {
  state.chosenBaseMap = d3.select(".base-map-select").node().value;
  console.log(state.chosenBaseMap);
  updateView();
});

function loadAndProcessGlobeData() {
  d3.csv("/data/" + state.chosenDataFile).then((csvData) => {
    state.currentDataset = csvData;
    updateView();
  });
}

function populateDropDowns(detail) {
  state.chosenDataFile = detail.mapData[0].dataFile;
  state.chosenTheme = detail.mapData[0].colors;
  state.chosenBaseMap = detail.mapData[0].baseMap;

  // Fill DropDowns
  const dataFilesOptions = detail.mapData.map((d) => {
    return {
      value: d.dataFile,
      label: d.dataName,
    };
  });

  const themesOptions = detail.colors.map((d) => {
    return {
      value: d.value,
      label: d.name,
    };
  });

  const baseMapOptions = detail.baseMaps.map((d) => {
    return {
      value: d.value,
      label: d.name,
    };
  });
  // d3.select('.data-select').html(`options...`)
  d3.select(".data-select").html(`${dataFilesOptions}`);
  d3.select(".theme-select").html(`${themesOptions}`);
  d3.select(".base-map-select").html(`${baseMapOptions}`);

  // Add Choices for all selects

  /* 
       d3.selectAll('.dropdown').each(function()=>{
           this._choice =  new Choice(this)...
       })
    */

  // d3.selectAll(".dropdown-select").each(function () {
  //   console.log(this);
  //   this._choice = new Choices(this, {
  //     choices: dataFilesOptions,
  //     position: "bottom",
  //     shouldSort: false,
  //     itemSelectText: "",
  //     placeholder: false,
  //     searchEnabled: false,
  //   });
  // });

  const dataSelect = document.querySelector("#data_sel");
  const colorSelect = document.querySelector("#color_sel");
  const baseMapSelect = document.querySelector("#baseMap_sel");

  const dataChoice = new Choices(dataSelect, {
    choices: dataFilesOptions,
    position: "bottom",
    shouldSort: false,
    itemSelectText: "",
    placeholder: true,
    placeholderValue: "hggh",
    searchEnabled: false,
  });

  const colorChoice = new Choices(colorSelect, {
    choices: themesOptions,
    position: "bottom",
    shouldSort: false,
    itemSelectText: "",
    placeholder: true,
    placeholderValue: "hj",
    searchEnabled: false,
  });
  const baseMapChoice = new Choices(baseMapSelect, {
    choices: baseMapOptions,
    position: "bottom",
    shouldSort: false,
    itemSelectText: "",
    placeholder: true,
    placeholderValue: "ghg",
    searchEnabled: false,
  });

  dataSelect.addEventListener(
    "change",
    function (event) {
      console.log(event.detail.value);
    },
    false
  );
}

function updateView() {
  setNewData();
  setLegend();
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

function setNewData() {
  toDataURL(
    //"//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
    "./basemaps/white.png",
    function (dataUrl) {
      console.log("RESULT:", dataUrl);
      globe.globeImageUrl(dataUrl);
    }
  );
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
}

function setLegend() {
  console.log("setting legend");
  Legend(
    d3.scaleLinear().domain([0, 50, 100]).range(["red", "blue", "green"]),
    {
      title: "Annual Potential Evaporation",
      tickSize: 0,
      container: d3.select(".color-legend-container"),
    }
  );
}

export { state };
