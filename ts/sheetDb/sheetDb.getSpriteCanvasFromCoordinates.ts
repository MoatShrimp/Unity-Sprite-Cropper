sheetDb.prototype.getSpriteCanvasFromCoordinates = function (this:SheetDB, key:string, event:MouseEvent):HTMLCanvasElement {


    
    const sheet:Sheet = this[key];
    const image = sheet.imageElement;

    const offset = image.getBoundingClientRect();
    console.log(offset);
	const xScale = image.naturalWidth / offset.width;
	const yScale = image.naturalHeight / offset.height;

    const posX = Math.trunc((event.clientX - offset.x) * xScale);
    //inverting posY to match 
    const posY = image.naturalHeight - Math.trunc((event.clientY - offset.y) * yScale);
    
    console.log(`${posX}.${posY}`);

    let meta = sheet.metaData.find(meta => 
        posX >= meta.x &&
        posY >= meta.y && 
        posX <= meta.x + meta.width &&         
        posY <= meta.y + meta.height
    )

    meta = meta ?? sheet.metaData[0];
    return this.getSpriteCanvas(key, meta);
}