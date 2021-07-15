sheetDb.prototype.removeLiTitle = function (key) {

    const sheet = this[key];

    if (!sheet.liObject) {   return this;   }
    sheet.liObject.title = null;
    return this;
}