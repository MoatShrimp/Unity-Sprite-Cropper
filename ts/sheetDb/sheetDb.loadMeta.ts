sheetDb.prototype.loadMeta = async function (key:string) {

    const sheet = this[key];
    if (!sheet.metaFile) { return null; }

    function readFileAsync(file) {
        return new Promise<string>((resolve, reject) => {

            const reader = new FileReader();
            
            reader.onload = () => { resolve(<string>reader.result); };
            reader.onerror = reject;

            reader.readAsText(file);
        });
    }    

    const input:string = await readFileAsync(sheet.metaFile);
    const spriteList = input.split("name: ");

    const metaArr:Meta[] = [];

    for (let i = 1; i < spriteList.length; ++i) {

        const allLines = spriteList[i].split("\n");
        const meta = {
            name: allLines[0],
            x: parseInt(allLines[3].split("x: ")[1]),
            y: parseInt(allLines[4].split("y: ")[1]),
            width: parseInt(allLines[5].split("width: ")[1]),
            height: parseInt(allLines[6].split("height: ")[1])
        };

        meta.y = sheet.imageElement.height - (meta.y + meta.height);
        metaArr.push(meta);
    }
    
    metaArr.sort((a,b) => 
        (a.x > b.x) ? 1 :
        (b.x > a.x) ? -1 :
        (a.y > b.y) ? 1 :
        (b.y > a.y) ? -1 :
        0
    );

    return metaArr;
}