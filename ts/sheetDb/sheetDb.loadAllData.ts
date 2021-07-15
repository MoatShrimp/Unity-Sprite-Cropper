sheetDb.prototype.loadAllData = function (display:HTMLImageElement, select:HTMLSelectElement) {

    for (const key of Object.keys(this)) {

        const sheet = this[key];
        
        if (sheet.imgData || !(sheet.imgFile && sheet.metaFile)) {  continue;   }

        this.loadImage(key).then( image => {
            sheet.imageElement = image;
            
            this.loadMeta(key).then (metaArr => {

            sheet.metaData = metaArr;
            this.createSelectElement(key);

            });
        });
    }
}