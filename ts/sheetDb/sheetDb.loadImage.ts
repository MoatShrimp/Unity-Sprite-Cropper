sheetDb.prototype.loadImage = async function (key:string) {

    const sheet = this[key];
    if (!sheet.imgFile) { return null; }

    function readFileAsync(file) {
        return new Promise<string>((resolve, reject) => {

            const reader = new FileReader();
            
            reader.onload = () => { resolve(<string>reader.result); };
            reader.onerror = reject;

            reader.readAsDataURL(file);
        });
    }
    
    const imageSrc:string = await readFileAsync(sheet.imgFile);
    sheet.imgData = imageSrc;
    const image = new Image();
    image.classList.add("js-sheet-image");
    image.src = imageSrc;
    await image.decode();

    
    return image;
}