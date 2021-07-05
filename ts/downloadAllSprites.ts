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

function downloadTest(sheet:HTMLImageElement, metaArr:SpriteMeta[], folderName:string) {

	const zip = new JSZip();
	const imageFolder = zip.folder(folderName);	

	for (let i = 0; i < metaArr.length; ++i) {

		const current = metaArr[i];

		getSpriteCanvas(sheet, current).
		toBlob( blob => {
			imageFolder.file(`${current.name}.png`, blob);
			if (i + 1 === metaArr.length) {
				zip.generateAsync({type:"blob"}).then( (blob) => {
					saveAs(blob, `${folderName}.zip`);
				});
			}
		});
	}
}



function quickDownload(sheet:HTMLImageElement, metaArr:SpriteMeta[], folderName:string) {

	const zipObj = {};
	const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');
	ctx.drawImage( sheet, 0, 0 );

	for(const sprite of metaArr) {
		const name = `${sprite.name}.png`;
		const file = new Uint8Array(
			ctx.getImageData(
				sprite.x,
				sprite.y,
				sprite.width,
				sprite.height				
			).data.buffer
		)

		zipObj[name] = [file,{level:0}];
	}
	console.log(zipObj);
	fflate.zip(zipObj, {}, function(err, out) {
		const blob = new Blob([out], {
			type: "application/octet-stream"
		  });
		console.log(blob);
        saveAs(blob, `${folderName}.zip`);
    });
}