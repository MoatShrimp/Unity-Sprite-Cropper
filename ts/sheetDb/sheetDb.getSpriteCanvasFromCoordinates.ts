sheetDb.prototype.getSpriteCanvasFromCoordinates = function (key:string, x:number, y:number) {

    const sheet = this[key];
    
    const meta = sheet.metaData.find(meta => {
        x >= meta.x &&
        y >= meta.y && 
        x <= meta.x + meta.width &&         
        y <= meta.y + meta.height
    })

    return this.getSpriteCanvas(key, meta);
}