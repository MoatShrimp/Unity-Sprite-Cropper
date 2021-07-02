//define dom elements
const inputArea:HTMLFieldSetElement = byId("file-input");
const imageInput:HTMLInputElement = byId("image-file-input");
const metaInput:HTMLInputElement = byId("meta-file-input");
const spriteDropDown:HTMLSelectElement = byId("sprite-selection");
const selectedSprite:HTMLDivElement = byId("loaded-sprite");
const loadedSheet:HTMLImageElement = byId("loaded-sprite-sheet");
const reloadBtn:HTMLButtonElement = byId("reload-button");

//main array for storing SpriteMeta
var metaArr:SpriteMeta[] = null;

//recallable event
const dataEvent = new Event("change");

//load meta data when both a sheet and corresponding meta file are loaded
inputArea.addEventListener("change", () => {

	if (imageInput.files[0] && metaInput.files[0]) {

		if (metaInput.files[0].name.slice(0, -5) === imageInput.files[0].name) {

			const metaFile = metaInput.files[0];
			const reader = new FileReader();
			
			reader.onload = (e) => {

				const rawMeta = YAML.parse(<string>e.target.result).TextureImporter.spriteSheet.sprites;

				metaArr = rawMeta.map(sprite => {

					const meta = sprite.rect;

					return {
						name:sprite.name,
						height:parseInt(meta.height), 
						width:parseInt(meta.width),
						x:parseInt(meta.x),
						y:loadedSheet.naturalHeight - parseInt(meta.y + meta.height)
					};
				});

				//sorting the sprites from a to z
				metaArr.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))

				selectedSprite.innerHTML = null;
				spriteDropDown.innerHTML = null;
				for (const index in metaArr) {
					const selection = document.createElement("option");
					selection.value = index;
					selection.text = metaArr[index].name;
					spriteDropDown.add(selection);
				}
				spriteDropDown.dispatchEvent(dataEvent);
			};
			reader.readAsText(metaFile);
		}
		else {
			console.log("files not matching");
		}
	}
});

spriteDropDown.addEventListener("change", () => {
	selectedSprite.innerHTML = null;
	const currentSprite = metaArr[parseInt(spriteDropDown.value)];
	selectedSprite.appendChild(getSpriteCanvas(loadedSheet, currentSprite));		
});

loadedSheet.addEventListener("click", (event) => {
	spriteDropDown.value = getClickedSpriteIndex(event, loadedSheet, metaArr).toString();
	spriteDropDown.dispatchEvent(dataEvent);
});

imageInput.addEventListener("change", () => {

	if (imageInput.files[0]) {

		const reader = new FileReader();

		reader.onload = (e)=> {
			if(e.target.result){
				loadedSheet.src = <string>e.target.result;
			}
		};
		reader.readAsDataURL(imageInput.files[0]);
	}
});

reloadBtn.addEventListener("click", () => {
	imageInput.dispatchEvent(dataEvent);
	inputArea.dispatchEvent(dataEvent);
});