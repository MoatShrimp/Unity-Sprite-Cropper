sheetDb.prototype.loadAllData = function (this:SheetDB, sheetWrap:HTMLImageElement, selectWrap:HTMLSelectElement, spriteWrap:HTMLCanvasElement) {

    let notLoaded = true;
    const loadedSheet = sheetWrap.querySelector("img");

    for (const key of Object.keys(this)) {

        const sheet:Sheet = this[key];        
        
        if (sheet.imageElement || !(sheet.imgFile && sheet.metaFile)) {  continue;   }

        Promise.all([this.loadImage(key), this.loadMeta(key)]).then( ([image, metaArr]) => {

            sheet.imageElement = image;
            sheet.metaData = metaArr;
            this.createSelectElement(key);

            if (!loadedSheet?.src && notLoaded) {                
                notLoaded = false;
                this.loadSheetToDom(key, sheetWrap, selectWrap, spriteWrap);
            }
        });
    }
}