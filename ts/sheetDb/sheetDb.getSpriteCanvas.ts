sheetDb.prototype.getSpriteCanvasFromSelect = function (key, meta) {

    const sheet = this[key];

    if (!sheet.imageElement) { return; }
    
    const canvas = document.createElement("canvas");
    canvas.width = meta.width;
	canvas.height = meta.height;

    const ctx = canvas.getContext('2d');

    ctx.drawImage(
        sheet.imageElement,
		meta.x,
		meta.y,
		meta.width,
		meta.height,
		0,
		0,
		meta.width,
		meta.height
    )

    return canvas;
}