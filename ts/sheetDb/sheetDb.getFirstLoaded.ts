sheetDb.prototype.getFirstLoaded = function (this:SheetDB) {

    const foundSheet:Sheet = Object.values(this).find( (sheet:Sheet) => sheet.imageElement);
    return foundSheet;
}