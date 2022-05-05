const data = {
    mapData: [],
    config: [],
    colors: [],
    baseMaps: [],
}

Promise.all(
    [
        d3.csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vTPgfKlYj5SArEm2pQQaFbvLYOOXTu_O5DgQN-DEFzjleFZF-JVzglIetgqtxKRxwVaNf52Nhr5iF_F/pub?gid=0&single=true&output=csv'),
        d3.csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vTPgfKlYj5SArEm2pQQaFbvLYOOXTu_O5DgQN-DEFzjleFZF-JVzglIetgqtxKRxwVaNf52Nhr5iF_F/pub?gid=1759536885&single=true&output=csv'),

    ])
    .then(([mapData, config, colors, baseMaps]) => {

        data.mapData = mapData;
        data.config = config;
        data.colors = colors;
        data.baseMaps = baseMaps;

        document.dispatchEvent(new CustomEvent("data-loaded", {
            detail: data
        }))

    })


export { data }