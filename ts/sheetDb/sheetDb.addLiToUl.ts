sheetDb.prototype.addLiToUl = function (this:SheetDB, ulElement:HTMLUListElement) {

    ulElement.innerHTML = null;
    Object.values(this).forEach( (sheet:Sheet) => { ulElement.appendChild(sheet.liElement); });

    return this;
}