sheetDb.prototype.getSpriteCanvasFromSelect = function (this:SheetDB, key:string):HTMLCanvasElement {

    const sheet:Sheet = this[key];

    if (!sheet.selectElement) { return; }
    
    const index = parseInt(sheet.selectElement.value);
    const meta = sheet.metaData[index];

    return this.getSpriteCanvas(key, meta);
}