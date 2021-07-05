//define dom elements
const spriteDropDown:HTMLSelectElement = byId("sprite-selection");
const selectedSprite:HTMLDivElement = byId("loaded-sprite");
const loadedSheet:HTMLImageElement = byId("loaded-sprite-sheet");
const reloadBtn:HTMLButtonElement = byId("reload-button");
const hover:HTMLDivElement = byId("hover");
const cont:HTMLDivElement = byId("cont");

//main array for storing SpriteMeta
let metaArr:SpriteMeta[] = null;
let currentSpriteIndex = 0;

//recallable event
const dataEvent = new Event("change");


spriteDropDown.addEventListener("change", () => {
	selectedSprite.innerHTML = null;
	const hover = document.createElement("div");
	hover.id = "hover-image";

	selectedSprite.appendChild(hover);

	const currentSprite = metaArr[parseInt(spriteDropDown.value)];
	selectedSprite.appendChild(getSpriteCanvas(loadedSheet, currentSprite));		
});

loadedSheet.addEventListener("click", (event) => {
	spriteDropDown.value = getClickedSpriteIndex(event, loadedSheet, metaArr).toString();
	spriteDropDown.dispatchEvent(dataEvent);
});
//Upload Part

const dropArea = byId('drop-area');
const multiFile:HTMLInputElement = byId('file-upload');
const loadedList:HTMLUListElement = byId('loaded-list');
const donwloadArrow:HTMLImageElement = byClass("upload-arrow-top")[0];

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
	dropArea.addEventListener(eventName, function(e) {
		e.preventDefault();
		e.stopPropagation();
	});
	loadedList.addEventListener(eventName, function(e) {
		e.preventDefault();
		e.stopPropagation();
	});
});

['dragenter', 'dragover'].forEach(eventName => {
	dropArea.addEventListener(eventName, () => {
		dropArea.classList.add('highlight');
	});
	loadedList.addEventListener(eventName, () => {
		loadedList.classList.add('highlight');
	});
});

['dragleave', 'drop'].forEach(eventName => {
	dropArea.addEventListener(eventName, () => {
		dropArea.classList.remove('highlight');
	});
	loadedList.addEventListener(eventName, () => {
		loadedList.classList.remove('highlight');
	});
});



dropArea.addEventListener('drop', (e) => {	
	manageFiles(e.dataTransfer.files);	
});
loadedList.addEventListener('drop', (e) => {	
	donwloadArrow.classList.add("move-arrow");
	setTimeout(() => {  donwloadArrow.classList.remove("move-arrow"); }, 250);
	manageFiles(e.dataTransfer.files);

});

multiFile.addEventListener("change", () => {
	manageFiles(multiFile.files);
});

dropArea.addEventListener("click", () => {
	multiFile.click();
});


loadedList.addEventListener("click", (event) => {
	const clickedElement = <HTMLElement>event.target;
	if (clickedElement.tagName === "LI" && !(clickedElement.classList.contains("missing-item"))) {

		const index = Array.from(loadedList.children).indexOf(clickedElement);
		const currentPair = pairArr[index];

		const reader = new FileReader();

		reader.onload = (e)=> {
			if(e.target.result){
				loadedSheet.src = <string>e.target.result;
			}
		};
		reader.readAsDataURL(currentPair.img);

		quickReader(currentPair.meta).then(value => {
			metaArr = value;

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
		});
	}
});

const imageArea = byId("image-area");

