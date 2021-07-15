sheetDb.prototype.readFileAsync = function (file:File, asDataUrl:boolean = true) {

    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();            
        reader.onload = () => { resolve(<string>reader.result); };
        reader.onerror = reject;

        asDataUrl ? reader.readAsDataURL(file) : reader.readAsText(file);
    });
}