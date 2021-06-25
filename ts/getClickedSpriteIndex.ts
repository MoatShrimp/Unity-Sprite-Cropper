function getClickedSpriteIndex (event:MouseEvent, sheet:HTMLImageElement, metaArr:SpriteMeta[]) {
    const offset = sheet.getBoundingClientRect();
	const xScale = sheet.naturalWidth / offset.width;
	const yScale = sheet.naturalHeight / offset.height;

    const clickX = Math.trunc((event.clientX - offset.x) * xScale);
    const clickY = Math.trunc((event.clientY - offset.y) * yScale);

    const spriteIndex = metaArr.findIndex(sprite =>
        clickX >= sprite.x &&
        clickY >= sprite.y && 
        clickX <= sprite.x + sprite.width &&         
        clickY <= sprite.y + sprite.height
    );

    return spriteIndex;
}