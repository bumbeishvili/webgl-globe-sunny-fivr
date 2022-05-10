import { data } from './main.js';
import { globe } from './globe.js';
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



document.addEventListener('local-selects-changed', (changedData) => {
    updateView();
})

d3.select('data-select').on('change', () => {
    const chosenDataFile = d3.select('.data-select').node().value;
    state.chosenDataFile = chosenDataFile;;
    loadAndProcessGlobeData();
})

d3.select('theme-select').on('change', () => {
    state.chosenTheme = d3.select('.theme-select').node().value;
    updateView()
})

d3.select('base-map-select').on('change', () => {
    state.chosenBaseMap = d3.select('.base-map-select').node().value;
    updateView()
})



function loadAndProcessGlobeData() {
    d3.csv('./data/' + state.chosenDataFile).then(csvData => {
        state.currentDataset = csvData;
        updateView();
    })
}


function populateDropDowns({ mapData }) {
    state.chosenDataFile = mapData[0].dataFile;
    // state.chosenTheme...
    // state.chosenBaseMap...

    // Fill DropDowns
    // d3.select('.data-select').html(`options...`)


    // Add Choices for all selects 

    /* 
       d3.selectAll('.dropdown').each(function()=>{
           this._choice =  new Choice(this)...
       })
    */

}

function updateView() {
    setNewData()
    setLegend()
}

function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}



function setNewData() {


    toDataURL('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg', function (dataUrl) {
        console.log('RESULT:', dataUrl)
        globe.globeImageUrl(dataUrl);
    })
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
    console.log('setting legend');
    Legend(d3.scaleLinear().domain([0, 50, 100]).range(['red', 'blue', 'green']), {
        title: "Annual Potential Evaporation",
        tickSize: 0,
        container: d3.select('.color-legend-container')
    })
}


export { state };