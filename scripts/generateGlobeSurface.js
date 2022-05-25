import { globe } from "./globe.js";
import { state } from "./event-listeners.js";

const canvas = document.createElement("canvas");
const d3Canvas = d3.select(canvas).attr('width', '4096').attr('height', '2048');
const context = canvas.getContext('2d');
document.body.insertBefore(canvas, d3.select('.filters').node());


export function setNewData() {

    console.log('setting new configuration', state)

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
                drawData()
                addCanvasToGlobe();
            }

        }
    }
    make_base('./basemaps/' + state.chosenBaseMap)
    // make_base('./basemaps/white.png')

    function addCanvasToGlobe() {
        const base64Img = canvas.toDataURL("image/jpeg");
        console.log({ base64Img })
        globe.globeImageUrl(base64Img);
    }

    function drawData() {


        const graticule = d3.geoGraticule10();
        const lineWidth = 3;
        const graticuleColor = "blue";
        const width = 4096;
        const height = 2048;

        const project = d3
            .geoEquirectangular()
            .precision(0.1)
            .fitSize([width, height], { type: "Sphere" })
            .translate([width / 2, height / 2]);


        const path = d3.geoPath(project, context).pointRadius(1.5);

        // context.fillStyle = "#ff0000";
        // context.strokeStyle = '#ff0000'
        // context.fillRect(0, 0, width, height);

        context.beginPath();
        path(graticule);
        context.lineWidth = lineWidth;
        context.strokeStyle = graticuleColor;
        context.stroke();

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