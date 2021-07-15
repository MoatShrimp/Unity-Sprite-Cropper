sheetDb.prototype.getSpriteCanvas = function (this:SheetDB, key:string, meta:Meta) {

    const sheet:Sheet = this[key];

    if (!sheet.imageElement) { return; }
    
    const canvas = document.createElement("canvas");
    canvas.width = meta.width;
	canvas.height = meta.height;

    const ctx = canvas.getContext('2d');
    //Inverting y-axix to match drawImage
    const yInverted = sheet.imageElement.naturalHeight - (meta.y + meta.height);

    ctx.drawImage(
        sheet.imageElement,
		meta.x,
		yInverted,
		meta.width,
		meta.height,
		0,
		0,
		meta.width,
		meta.height
    )

    return canvas;
}