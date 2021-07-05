async function quickReader(file:File) {

    function readFileAsync(file) {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = () => {
                resolve(<string>reader.result);
            };
            reader.onerror = reject;
            reader.readAsText(file);

        });
    }


    const input:string = await readFileAsync(file);
    const spriteList = input.split("name: ");

    const output = [];

    for (let i = 1; i < spriteList.length; ++i) {

        const allLines = spriteList[i].split("\n");
        const meta = {
            name: allLines[0],
            x: parseInt(allLines[3].split("x: ")[1]),
            y: parseInt(allLines[4].split("y: ")[1]),
            width: parseInt(allLines[5].split("width: ")[1]),
            height: parseInt(allLines[6].split("height: ")[1])
        };

        meta.y = loadedSheet.naturalHeight - (meta.y + meta.height);
        output.push(meta);
    }
    
    return output

}