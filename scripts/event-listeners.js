import { data } from "./main.js";
import { globe } from "./globe.js";
import { Legend } from "./legend.d3.js";
import { setNewData } from "./generateGlobeSurface.js";

const state = {
  chosenDataFile: null,
  chosenTheme: null,
  chosenBaseMap: null,
  dataExtent: [0, 100],
  currentDataset: null,
};
var dataChoice;
var colorChoice;
var baseMapChoice;

document.addEventListener("data-loaded", ({ detail }) => {
  populateDropDowns(detail);
  loadAndProcessGlobeData();
});

document.addEventListener("keydown", function (event) {
  switch (event.keyCode) {
    case 37:
      leftArrow();
      break;
    case 38:
      upArrow();
      break;
    case 39:
      rightArrow();
      break;
    case 40:
      downArrow();
      break;
  }
});

document.addEventListener("local-selects-changed", (changedData) => {
  updateView();
});

d3.select(".data-select").on("change", () => {
  const chosenDataFile = d3.select(".data-select").node().value;

  state.chosenDataFile = chosenDataFile;

  let dataIndex = data.dataFilesArray.indexOf(state.chosenDataFile);
  state.chosenBaseMap = data.baseMaps.filter(
    (d) => d.name == data.mapData[dataIndex].baseMap
  )[0].value;

  baseMapChoice.setChoiceByValue(state.chosenBaseMap);

  state.chosenTheme = data.colors.filter(
    (d) => d.name == data.mapData[dataIndex].colors
  )[0].value;

  updateColorsArray();

  colorChoice.setChoiceByValue(state.chosenTheme);

  loadAndProcessGlobeData();
});

d3.select(".theme-select").on("change", () => {
  state.chosenTheme = d3.select(".theme-select").node().value;

  updateColorsArray();

  updateView();
});

d3.select(".base-map-select").on("change", () => {
  state.chosenBaseMap = d3.select(".base-map-select").node().value;
  updateView();
});

function loadAndProcessGlobeData() {
  d3.csv("/data/" + state.chosenDataFile).then((csvData) => {
    console.log(csvData);
    state.currentDataset = csvData.filter(
      (d) => d.Value !== "-9.99e+08" && d.Value !== "-9.99E+08"
    );
    updateView();
  });
}

function leftArrow() {
  if (data.colorsValueArray.indexOf(state.chosenTheme) > 0) {
    state.chosenTheme =
      data.colors[data.colorsValueArray.indexOf(state.chosenTheme) - 1].value;
  }
  colorChoice.setChoiceByValue(state.chosenTheme);

  updateView();
}
function rightArrow() {
  if (
    data.colorsValueArray.indexOf(state.chosenTheme) <
    data.colorsValueArray.length - 1
  ) {
    state.chosenTheme =
      data.colors[data.colorsValueArray.indexOf(state.chosenTheme) + 1].value;
  }
  colorChoice.setChoiceByValue(state.chosenTheme);

  updateView();
}

function upArrow() {
  if (data.dataFilesArray.indexOf(state.chosenDataFile) > 0) {
    state.chosenDataFile =
      data.mapData[
        data.dataFilesArray.indexOf(state.chosenDataFile) - 1
      ].dataFile;
  }

  let dataIndex = data.dataFilesArray.indexOf(state.chosenDataFile);
  state.chosenBaseMap = data.baseMaps.filter(
    (d) => d.name == data.mapData[dataIndex].baseMap
  )[0].value;
  state.chosenTheme = data.colors.filter(
    (d) => d.name == data.mapData[dataIndex].colors
  )[0].value;

  colorChoice.setChoiceByValue(state.chosenTheme);

  baseMapChoice.setChoiceByValue(state.chosenBaseMap);
  dataChoice.setChoiceByValue(state.chosenDataFile);

  loadAndProcessGlobeData();
}
function downArrow() {
  if (
    data.dataFilesArray.indexOf(state.chosenDataFile) <
    data.dataFilesArray.length - 1
  ) {
    state.chosenDataFile =
      data.mapData[
        data.dataFilesArray.indexOf(state.chosenDataFile) + 1
      ].dataFile;
  }

  let dataIndex = data.dataFilesArray.indexOf(state.chosenDataFile);
  state.chosenBaseMap = data.baseMaps.filter(
    (d) => d.name == data.mapData[dataIndex].baseMap
  )[0].value;
  state.chosenTheme = data.colors.filter(
    (d) => d.name == data.mapData[dataIndex].colors
  )[0].value;

  colorChoice.setChoiceByValue(state.chosenTheme);

  baseMapChoice.setChoiceByValue(state.chosenBaseMap);
  dataChoice.setChoiceByValue(state.chosenDataFile);

  loadAndProcessGlobeData();
}

function populateDropDowns(detail) {
  console.log({ detail });
  const file = detail.mapData[0];
  state.chosenDataFile = file.dataFile;
  state.chosenTheme = detail.colors.filter(
    (d) => d.name == file.colors
  )[0].value;
  state.chosenBaseMap = detail.baseMaps.filter(
    (d) => d.name == file.baseMap
  )[0].value;

  updateColorsArray();

  d3.csv("/data/" + state.chosenDataFile).then((csvData) => {
    console.log(csvData);
    state.currentDataset = csvData.filter(
      (d) => d.Value !== "-9.99e+08" && d.Value !== "-9.99E+08"
    );
    // updateView();
  });

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

  // Add Choices for all selects

  const dataSelect = document.querySelector("#data_sel");
  const colorSelect = document.querySelector("#color_sel");
  const baseMapSelect = document.querySelector("#baseMap_sel");

  dataChoice = new Choices(dataSelect, {
    choices: dataFilesOptions,
    position: "bottom",
    shouldSort: false,
    itemSelectText: "",
    searchEnabled: true,
  });

  colorChoice = new Choices(colorSelect, {
    choices: themesOptions,
    position: "bottom",
    shouldSort: false,
    itemSelectText: "",
    searchEnabled: true,
  });
  baseMapChoice = new Choices(baseMapSelect, {
    choices: baseMapOptions,
    position: "bottom",
    shouldSort: false,
    itemSelectText: "",
    searchEnabled: true,
  });

  baseMapChoice.setChoiceByValue(state.chosenBaseMap);
}
function updateView() {
  setNewData();
  setLegend();
}

function setLegend() {
  console.log("setting legend");
  console.log(state.currentDataset);
  Legend(
    d3
      .scaleLinear()
      .domain([
        d3.min(state.currentDataset, (d) => d.Value),
        d3.max(state.currentDataset, (d) => d.Value),
      ])
      .range(state.chosenThemeArray),
    {
      title:
        data.mapData[data.dataFilesArray.indexOf(state.chosenDataFile)]
          .dataName,
      tickSize: 0,
      container: d3.select(".color-legend-container"),
    }
  );
  //(
  //   d3.scaleLinear().domain([0, 50, 100]).range(["red", "blue", "green"]),
  //   {
  //     title: "Annual Potential Evaporation",
  //     tickSize: 0,
  //     container: d3.select(".color-legend-container"),
  //   }
  // );
}

function openLink() {
  window.open(data.config[0].value, "_blank");
}
export { state, openLink };

function updateColorsArray() {
  let colors = state.chosenTheme
    .replace("[", "")
    .replace("]", "")
    .replaceAll('"', "")
    .split(",");

  state.chosenThemeArray = colors;
}
