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
  globe.globeMaterial().displacementScale = +data.config.filter(d => d.name == 'displacement')[0].value;
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

  setBasemapClass();

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
  setBasemapClass();
  updateView();
});

function loadAndProcessGlobeData() {
  d3.csv("/data/" + state.chosenDataFile).then((csvData) => {
    state.currentDataset = csvData;
    state.currentDataset.forEach((d) => {
      if (d.Value == "-9.99e+08" || d.Value == "-9.99E+08" || d.Value == "9.99E+08" || d.Value == "9.99E+08") {
        d.anomaly = 'true';
      }
    })
    state.currentDataset.forEach(d3.autoType)
    updateView();
  });
}

function leftArrow() {
  if (data.colorsValueArray.indexOf(state.chosenTheme) > 0) {
    state.chosenTheme =
      data.colors[data.colorsValueArray.indexOf(state.chosenTheme) - 1].value;
  }
  colorChoice.setChoiceByValue(state.chosenTheme);
  updateColorsArray();
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
  updateColorsArray();
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
  setBasemapClass();

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
  setBasemapClass();

  state.chosenTheme = data.colors.filter(
    (d) => d.name == data.mapData[dataIndex].colors
  )[0].value;

  colorChoice.setChoiceByValue(state.chosenTheme);

  baseMapChoice.setChoiceByValue(state.chosenBaseMap);
  dataChoice.setChoiceByValue(state.chosenDataFile);

  loadAndProcessGlobeData();
}

function setBasemapClass() {
  const theme = data.baseMaps.filter(d => d.value == state.chosenBaseMap)[0].name;
  d3.select('body').attr('class', theme)
}

function populateDropDowns(detail) {
  const file = detail.mapData[0];
  state.chosenDataFile = file.dataFile;
  state.chosenTheme = detail.colors.filter(
    (d) => d.name == file.colors
  )[0].value;
  state.chosenBaseMap = detail.baseMaps.filter(
    (d) => d.name == file.baseMap
  )[0].value;
  setBasemapClass();

  updateColorsArray();

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
      label: `<div style="display:inline-block"> ${JSON.parse(d.value).map(v => `<div style="background-color:${v};display:inline-block;width:8px;height:10px;"></div>`).join('')} </div> &nbsp;` + d.name,
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
    allowHTML: true,
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
  globe.backgroundImageUrl(
    d3.select("body").attr("class") == 'Light' ? './basemaps/light.png' : "//unpkg.com/three-globe/example/img/night-sky.png")
  setNewData();
  setLegend();
}

function setLegend() {
  const min = d3.min(state.currentDataset.filter(d => !d.anomaly), (d) => d.Value);
  const max = d3.max(state.currentDataset.filter(d => !d.anomaly), (d) => d.Value);
  const domainValues = state.chosenThemeArray.map((d, i, arr) => {
    return min + (max - min) * i / (arr.length - 1);
  })
  Legend(
    d3
      .scaleLinear()
      .domain(domainValues)
      .range(state.chosenThemeArray),
    {
      title:
        data.mapData[data.dataFilesArray.indexOf(state.chosenDataFile)]
          .dataName,
      tickSize: 0,
      container: d3.select(".color-legend-container"),
    }
  );

}

function openLink(e) {
  const query = `lat=${e.lat}&lon=${e.lng}`
  window.open(data.config[0].value + query, "_blank");
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
