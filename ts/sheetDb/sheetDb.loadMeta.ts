sheetDb.prototype.loadMeta = async function (this:SheetDB, key:string) {

    const sheet:Sheet = this[key];
    if (!sheet.metaFile) { return null; }

    const metaDataStringified:string = await this.readFileAsync(sheet.metaFile, false);
    const metaEntries = metaDataStringified.split("name: ");//each entry always starts with "name: "

    const metaArr:Meta[] = [];

    //Skipping first entry of spriteList since that only contains excess data
    for (let i = 1; i < metaEntries.length; ++i) {

        const allLines = metaEntries[i].split("\n");
        const meta = {
            name: allLines[0],
            x: parseInt(allLines[3].split("x: ")[1]),
            y: parseInt(allLines[4].split("y: ")[1]),
            width: parseInt(allLines[5].split("width: ")[1]),
            height: parseInt(allLines[6].split("height: ")[1])
        };               
        metaArr.push(meta);
    }
    
    //sort array by coordinates
    metaArr.sort((a,b) => 
        (a.x > b.x) ? 1 :
        (b.x > a.x) ? -1 :
        (a.y > b.y) ? 1 :
        (b.y > a.y) ? -1 :
        0
    );

    return metaArr;
}