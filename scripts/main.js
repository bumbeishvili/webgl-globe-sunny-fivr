const data = {
  mapData: [],
  config: [],
  colors: [],
  baseMaps: [],
  dataFilesArray: [],
  colorsValueArray: [],
  colorsNameArray: [],
};

Promise.all([
  d3.csv(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSCX-tqChddO0i65Mds7acpShLwUAEsFzLtXhEs8hOq2Ir7r_kja9o5lQO1muo5lf4kkCOEG_56YykM/pub?gid=0&single=true&output=csv"
  ),
  d3.csv(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSCX-tqChddO0i65Mds7acpShLwUAEsFzLtXhEs8hOq2Ir7r_kja9o5lQO1muo5lf4kkCOEG_56YykM/pub?gid=1759536885&single=true&output=csv"
  ),
  d3.csv(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSCX-tqChddO0i65Mds7acpShLwUAEsFzLtXhEs8hOq2Ir7r_kja9o5lQO1muo5lf4kkCOEG_56YykM/pub?gid=497957117&single=true&output=csv"
  ),
  // d3.csv(
  //   "https://docs.google.com/spreadsheets/d/e/2PACX-1vSCX-tqChddO0i65Mds7acpShLwUAEsFzLtXhEs8hOq2Ir7r_kja9o5lQO1muo5lf4kkCOEG_56YykM/pub?gid=498188574&single=true&output=csv"
  // ),
]).then(([mapData, config, colors]) => {
  const baseMaps = [
    {
      "name": 'Light',
      "value": 'white.png'
    },
    {
      "name": 'Satellite',
      "value": 'satellite.jpeg'
    }
  ]
  data.mapData = mapData;
  data.config = config;
  data.colors = colors;
  data.baseMaps = baseMaps;

  mapData.forEach((element) => {
    data.dataFilesArray.push(element.dataFile);
  });
  colors.forEach((element) => {
    data.colorsValueArray.push(element.value);
  });
  colors.forEach((element) => {
    data.colorsNameArray.push(element.name);
  });
  document.dispatchEvent(
    new CustomEvent("data-loaded", {
      detail: data,
    })
  );
});

export { data };


