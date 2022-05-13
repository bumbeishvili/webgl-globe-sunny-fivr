const data = {
  mapData: [],
  config: [],
  colors: [],
  baseMaps: [],
  dataFIlesArray: [],
};

Promise.all([
  d3.csv(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTPgfKlYj5SArEm2pQQaFbvLYOOXTu_O5DgQN-DEFzjleFZF-JVzglIetgqtxKRxwVaNf52Nhr5iF_F/pub?gid=0&single=true&output=csv"
  ),
  d3.csv(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTPgfKlYj5SArEm2pQQaFbvLYOOXTu_O5DgQN-DEFzjleFZF-JVzglIetgqtxKRxwVaNf52Nhr5iF_F/pub?gid=1759536885&single=true&output=csv"
  ),
  d3.csv(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTPgfKlYj5SArEm2pQQaFbvLYOOXTu_O5DgQN-DEFzjleFZF-JVzglIetgqtxKRxwVaNf52Nhr5iF_F/pub?gid=497957117&single=true&output=csv"
  ),
  d3.csv(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTPgfKlYj5SArEm2pQQaFbvLYOOXTu_O5DgQN-DEFzjleFZF-JVzglIetgqtxKRxwVaNf52Nhr5iF_F/pub?gid=498188574&single=true&output=csv"
  ),
]).then(([mapData, config, colors, baseMaps]) => {
  data.mapData = mapData;
  data.config = config;
  data.colors = colors;
  data.baseMaps = baseMaps;

  mapData.forEach((element) => {
    data.dataFIlesArray.push(element.dataFile);
  });
  document.dispatchEvent(
    new CustomEvent("data-loaded", {
      detail: data,
    })
  );
});

export { data };
