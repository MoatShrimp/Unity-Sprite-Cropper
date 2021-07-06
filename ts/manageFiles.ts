interface SpritePair {
	img:File,
	meta:File
}
const pairArr:SpritePair[] = [];
const loaded:SpritePair[] = [];

function manageFiles(files:FileList) {

	const oldLength = pairArr.length;
	const re = /(?:\.([^.]+))?$/;

	Array.from(files).forEach( file => {
		const name = file.name;
		const ext = re.exec(name)[1].toString();
		if (ext === "png" && !(pairArr.some(pair => pair.img?.name === name))) {
			const index = pairArr.findIndex(pair => pair.meta?.name.slice(0, -5) === name);

			if (index > -1) {
				pairArr[index].img = file;
				loaded.push(pairArr[index]);
				let child:HTMLLIElement = null;
				if(child = <HTMLLIElement>loadedList.childNodes[index + 1]) {
					child.classList.remove("missing-item");
				}
				
			}
			else {
				pairArr.push({img:file, meta:null});
			}
		}
		else if (ext === "meta" && !(pairArr.some(pair => pair.meta?.name === name))) {
			const index = pairArr.findIndex(pair => pair.img?.name === name.slice(0, -5));
			if (index > -1) {
				pairArr[index].meta = file;
				loaded.push(pairArr[index]);
				let child:HTMLLIElement = null;
				if(child = <HTMLLIElement>loadedList.childNodes[index + 1]) {
					child.classList.remove("missing-item");
					
				}
			}
			else {
				pairArr.push({img:null, meta:file});
			}
		}
	});

	for (let i = oldLength; i < pairArr.length; ++i) {
		const item = document.createElement("li");
		let missingFlag = false;
		let name:string = null;
		if (pairArr[i].img) {
			name = pairArr[i].img.name.slice(0, -4);
			if (!(pairArr[i].meta)) {
				missingFlag = true;
			}
		}
		else {
			name = pairArr[i].meta.name.slice(0, -9);
			missingFlag = true;
		}

		if(name.length > 30) {
			const start = name.slice(0, 20);
			const end = name.slice(-15);
			name = `${start}...${end}`;
		}
		if (missingFlag){
			item.classList.add("missing-item");
		}
		item.textContent = name;

		loadedList.appendChild(item);
	}

	if (loaded.length) {
		const spriteArea = byId("area1");
		imageArea.classList = ["box image-area-loaded"];
		spriteArea.classList = ["box loaded-sprite sprite-area-loaded"];
	}
}