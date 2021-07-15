sheetDb.prototype.getFirstLoaded = function () {

    const foundKey = Object.keys(this).find( key => this[key].imgData);
    return this[foundKey];
}