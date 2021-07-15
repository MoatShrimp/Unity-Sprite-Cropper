sheetDb.prototype.createAllLiElements = function () {

    for (const key of Object.keys(this)) {

        this.createLiElement(key);
    }
    return this;
}

