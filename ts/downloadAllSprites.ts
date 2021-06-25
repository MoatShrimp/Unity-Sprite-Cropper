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


function canvasToBlob(canvas) {
	return new Promise(resolve => canvas.toBlob(resolve));
}

async function newD(sheet:HTMLImageElement, metaArr:SpriteMeta[], folderName:string) {

	const zip = new JSZip();
	const imageFolder = zip.folder(folderName);
	
	for (const spriteMeta of metaArr){
		imageFolder.file(
			`${spriteMeta.name}.png`,
			await new Promise(resolve => 
				getSpriteCanvas(sheet, spriteMeta).toBlob(resolve))
		)
	}

	zip.generateAsync({type:"blob"}).then( (blob) => {
		saveAs(blob, `${folderName}.zip`);
	});
 
}/*
	const promises = metaArr.map(async spriteMeta => {
		const promise = await getSpriteCanvas(sheet, spriteMeta).
		toBlob( blob => {
			imageFolder.file(`${spriteMeta.name}.png`, blob);
			console.log(blob);
		});
	}

	);

	await Promise.all(promises);

	zip.generateAsync({type:"blob"}).then( (blob) => {
		saveAs(blob, `${folderName}.zip`);
	});
}
/*


	})

	for (const spriteMeta of metaArr) {
		getSpriteCanvas(sheet, spriteMeta).
				toBlob( async blob => {
					console.log( await imageFolder.file(`${spriteMeta.name}.png`, blob));
				console.log(blob);
		});
	};

		zip.generateAsync({type:"blob"}).then( (blob) => {
			saveAs(blob, `${folderName}.zip`);
		});
}*/