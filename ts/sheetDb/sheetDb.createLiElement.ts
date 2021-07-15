sheetDb.prototype.createLiElement = function (this:SheetDB, key:string) {
    
    const sheet:Sheet = this[key];

    if (sheet.liElement) {   return this;   }

    const li = document.createElement("li");
    li.textContent = key;
    li.dataset.key = key;

    if (!sheet.imgFile) {   li.title = "Missing image file"; li.classList.add("missing-item") }
    else if (!sheet.metaFile) { li.title = "Missing meta file";  li.classList.add("missing-item") }

    sheet.liElement = li;   

    return this;
}