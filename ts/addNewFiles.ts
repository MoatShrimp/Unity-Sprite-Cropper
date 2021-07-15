interface FilePair {
    img:File,
    meta:File
}

function addNewFiles(files:FileList, pairs:FilePair[]) {

    for (const file of Array.from(files)) {

        const name = file.name;
        const namepair = {
            img:file.name
        }

        if ((name.slice(-4).toLowerCase() === ".png") && 
            !(pairs.some(pair => pair.img?.name === name))) {

            const index = pairs.findIndex(pair => pair.meta?.name.slice(0, -5) === name);

            if (index > -1) {
                pairs[index].img = file;
            }
            else {
                pairs.push({img:file, meta:null})
            }
        }

        else if ((name.slice(-5).toLowerCase() === ".meta") && 
                 !(pairs.some(pair => pair.meta?.name === name))) {
            
            const index = pairs.findIndex(pair => pair.img?.name.slice(0, -4) === name);

            if (index > -1) {
                pairs[index].img = file;
            }
            else {
                pairs.push({img:null, meta:file})
            }
        }
    }

    return pairs;
}