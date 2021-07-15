sheetDb.prototype.loadSheetToDom = function (
    this:SheetDB,
    key:string,
    sheetWrap:HTMLDivElement,
    selectWrap:HTMLDivElement,
    spriteWrap:HTMLSpanElement,) {     
        
        const sheet:Sheet = this[key];

        sheetWrap.innerHTML = null;
        sheetWrap.appendChild(sheet.imageElement);

        selectWrap.innerHTML = null;
        selectWrap.appendChild(sheet.selectElement);

        spriteWrap.innerHTML = null;
        spriteWrap.appendChild(this.getSpriteCanvasFromSelect(key));
}