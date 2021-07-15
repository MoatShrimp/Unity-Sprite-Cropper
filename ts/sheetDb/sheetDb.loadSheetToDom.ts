sheetDb.prototype.loadSheetToDom = function (
    key:string,
    sheetArea:HTMLImageElement, 
    spriteSelect:HTMLDivElement, 
    spriteCanvasArea:HTMLDivElement) {     
        
        const sheet = this[key];
        
        const newImage = sheet.imageElement;
        sheetArea.parentNode.replaceChild(newImage, sheetArea);
        sheetArea = newImage;

        const newSelect = sheet.selectElement;
        spriteSelect.parentNode.replaceChild(newSelect, spriteSelect);
        spriteSelect = newSelect;

        spriteCanvasArea.innerHTML = null;
        spriteCanvasArea.appendChild( this.getSpriteCanvasFromSelect(key) );

}