sheetDb.prototype.addFiles = function (files:FileList) {

    const newSheet = this.newSheet;

    for (const file of Array.from(files)) {

        const name = file.name;
        const ext = name.slice((name.lastIndexOf(".") - 1 >>> 0) + 2);
        const isPng = (ext === "png");
        const isMeta = (ext === "meta");

        if (!(isPng || isMeta)) {   continue;   }

        if (isPng) {
            const key = name.slice(0, -4);

            if (this[key]) {
                if (this[key].imgFile) {    continue;   }
                this[key].imgFile = file;
            }
            else {  
                this[key] = newSheet(file, null);
            }
        }

        else {
            const key = name.slice(0, -9);

            if (this[key]) {
                if (this[key].metaFile) {   continue;   }
                this[key].metaFile = file;
            }
            else {
                this[key] = newSheet(null, file);
            }
        }
    }
    this.createAllLiElements();

    return this;
}

