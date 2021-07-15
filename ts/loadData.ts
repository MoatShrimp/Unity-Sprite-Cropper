interface LoadedPairs {
    name:string,
    img:string,
    meta:string[]
}

function loadData (pairs:FilePair[], loaded:LoadedPairs[]) {
    
    for (const pair of pairs) {

        if(pair.img && pair.meta && !(loaded.some(entry => entry.name === pair.img.name))) {

            const reader = new FileReader();

            reader.onload = (e) => {
                if(e.target.result) {
                    const src = <string>e.target.result;

                    quickReader(pair.meta).then(value => {
                        let meta = value;
                        meta.sort((a,b) => 
                            (a.x > b.x) ? 1 :
                            (b.x > a.x) ? -1 :
                            (a.y > b.y) ? 1 :
                            (b.y > a.y) ? -1 :
                            0
                        );
                        loaded.push({
                            name:pair.img.name,
                            img:src,
                            meta:meta
                        });
                    });
                }
            }

            reader.readAsDataURL(pair.img);
        }
    }

    return loaded;
}