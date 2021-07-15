interface Meta {
    name:string,
    x:number,
    y:number,
    width:number,
    height:number
};

interface Sheet {
    imgFile:File,
    metaFile:File,
    imgData:String,    
    metaData:Meta[],
    imageElement:HTMLImageElement,
    selectElement:HTMLSelectElement,
    liElement:HTMLLIElement
}

interface SheetDB {
    string?:Sheet,
    addFiles:Function,
    addLiToUl:Function,
    createSelectElement:Function,
    createLiElement:Function,
    createAllLiElements:Function,
    removeLiTitle:Function,
    getFirstLoaded:Function,
    getSpriteCanvas:Function,
    getSpriteCanvasFromSelect:Function,
    getSpriteCanvasFromCoordinates:Function,
    loadAllData:Function,
    loadMeta:Function,
    loadImage:Function,
    loadSheetToDom:Function,
    newSheet:Function
}

function sheetDb() {}
const mainDb:SheetDB = new sheetDb();