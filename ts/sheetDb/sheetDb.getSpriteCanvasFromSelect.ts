sheetDb.prototype.getSpriteCanvasFromSelect = function (key) {

    const sheet = this[key];

    if (!sheet.selectElement) { return; }

    const index = parseInt(sheet.selectElement.value);
    const meta = sheet.metaDataAlphaDecending[index];

    return this.getSpriteCanvas(key, meta);
}