function downloadSprite(sheet:HTMLImageElement, spriteMeta:SpriteMeta) {
	const dataUrl = 
		getSpriteCanvas(sheet, spriteMeta).
		toDataURL();

	saveAs(dataUrl, `${spriteMeta.name}.zip`);
}