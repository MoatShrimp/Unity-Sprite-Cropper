sheetDb.prototype.loadImage = async function (this:SheetDB, key:string) {

    const sheet:Sheet = this[key];
    if (!sheet.imgFile) { return null; }
    
    const image = new Image();    
    image.src = await this.readFileAsync(sheet.imgFile, true);
    await image.decode();
    
    return image;
}