function getSpriteCanvas(sheet:HTMLImageElement, spriteMeta:SpriteMeta) {

	const canvas = document.createElement("canvas");
    canvas.width = spriteMeta.width;
	canvas.height = spriteMeta.height;

    const ctx = canvas.getContext('2d');

    ctx.drawImage(
        sheet,
		spriteMeta.x,
		spriteMeta.y,
		spriteMeta.width,
		spriteMeta.height,
		0,
		0,
		spriteMeta.width,
		spriteMeta.height
    )

    return canvas;
}