sheetDb.prototype.createAllLiElements = function (this:SheetDB) {

    Object.keys(this).forEach( (key) => { this.createLiElement(key); });

    return this;
}

