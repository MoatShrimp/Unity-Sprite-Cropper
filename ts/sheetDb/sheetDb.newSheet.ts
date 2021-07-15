sheetDb.prototype.newSheet = function (img:File = null, meta:File = null):Sheet {
    return {
        imgFile:img,
        metaFile:meta,
        imgData:null,
        metaData:[],
        imageElement:null,
        selectElement:null,
        liElement:null
    }
}