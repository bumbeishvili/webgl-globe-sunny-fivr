import { data } from './data.js';
import { Legend } from './legend.d3.js';



const state = {
    chosenDataFile: null,
    chosenTheme: null,
    chosenBaseMap: null,
    dataExtent: [0, 100],
    currentDataset: null,
}


document.addEventListener('data-loaded', ({ detail }) => {
    populateDropDowns(detail);
    loadAndProcessGlobeData();
})

document.addEventListener('data-selects-changed', ({ detail }) => {
    state.chosenDataFile = detail.chosenDataFile;;
    loadAndProcessGlobeData();
})


document.addEventListener('local-selects-changed', (changedData) => {
    updateView();
})



function loadAndProcessGlobeData() {
    d3.csv('/data/' + state.chosenDataFile).then(csvData => {
        state.currentDataset = csvData;
        updateView();
    })
}


function populateDropDowns({ mapData }) {
    state.chosenDataFile = mapData[0].dataFile;
    // Fill DropDowns
}

function updateView() {
    retrieveValues();
    setNewData()
    setLegend()
}

function setNewData() {

}


function retrieveValues() {
    //  state.chosenTheme = d3.select('.data-chosen-theme').node().value;

}


function setLegend() {
    console.log('setting legend');
    Legend(d3.scaleLinear().domain([0, 50, 100]).range(['red', 'blue', 'green']), {
        title: "Annual Potential Evaporation",
        tickSize: 0,
        container: d3.select('.color-legend-container')
    })
}


export { state };