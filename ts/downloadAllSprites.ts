function downloadAllSprites(sheet:HTMLImageElement, metaArr:SpriteMeta[], folderName:string) {

	let spriteCollection = [];

	for (const spriteMeta of metaArr) {
        const dataUrl = 
			getSpriteCanvas(sheet, spriteMeta).
			toDataURL("image/png").
			replace(/^data:image\/(png|jpg);base64,/, "");

        spriteCollection.push({name:spriteMeta.name, data:dataUrl});
	}

	const zip = new JSZip();
	const imageFolder = zip.folder(folderName);

	for (const image of spriteCollection) {
		imageFolder.file(`${image.name}.png`, image.data, {base64:true});
	}

	zip.generateAsync({type:"blob"}).then( (blob) => {
		saveAs(blob, `${folderName}.zip`);
	});
}