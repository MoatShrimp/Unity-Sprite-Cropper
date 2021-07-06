//yaml.js for reading the .meta files
declare var YAML: any; //yaml.js 0.3.0, github.com/jeremyfa/yaml.js/
//FileSaver for saving sprites with a specific file name
declare var saveAs: any; //FileSaver v2.0.5, github.com/eligrey/FileSaver.js/
//JSZip for zipping batches of sprites
declare var JSZip: any; //JSZip v3.6.0, github.com/Stuk/jszip/
declare var fflate: any; //JSZip v3.6.0, github.com/Stuk/jszip/

//SpriteMeta type
interface SpriteMeta {
    name:string,
    x:number,
    y:number,
    width:number,
    height:number
}

//getElementById shorthand
const byId:any = document.getElementById.bind(document);
const byClass:any = document.getElementsByClassName.bind(document);

function ofId(name) {

    function func() {
        return document.getElementById(name);
    }

    return func;
}

const adam = (name => ofId(name));

function convertRemToPixels(rem) {    
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}