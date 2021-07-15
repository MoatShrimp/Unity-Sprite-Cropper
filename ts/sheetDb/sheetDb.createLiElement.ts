sheetDb.prototype.createLiElement = function (key) {
    
    const sheet:Sheet = this[key];

    if (sheet.liElement) {   return this;   }

    const item = document.createElement("li");
    item.textContent = key;
    item.dataset.key = key;

    if (!sheet.imgFile) {
        item.title = "Missing image file";
    }

    else if (!sheet.metaFile) {
        item.title = "Missing meta file";
    }

    sheet.liElement = item;        
    return this;

}