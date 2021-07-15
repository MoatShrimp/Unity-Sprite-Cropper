//define dom elements
const spriteDropDown:HTMLSelectElement = byId("sprite-selection");
const selectedSprite:HTMLDivElement = byId("sprite-canvas-wrap");
const loadedSheet:HTMLImageElement = byId("loaded-sprite-sheet");
const reloadBtn:HTMLButtonElement = byId("reload-button");
const cont:HTMLDivElement = byId("cont");
const imageArea = byId("image-area");

//main array for storing SpriteMeta
let metaArr:SpriteMeta[] = null;
let currentSpriteIndex = 0;

//recallable event
const dataEvent = new Event("change");


spriteDropDown.addEventListener("change", () => {
	selectedSprite.innerHTML = null;
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
	
	fileEvent(e.dataTransfer.files, loadedList);

	//manageFiles(e.dataTransfer.files);	
});
loadedList.addEventListener('drop', (e) => {	
	donwloadArrow.classList.add("move-arrow");
	setTimeout(() => {  donwloadArrow.classList.remove("move-arrow"); }, 250);

	fileEvent(e.dataTransfer.files, loadedList);

	//manageFiles(e.dataTransfer.files);

});

multiFile.addEventListener("change", () => {

	fileEvent(multiFile.files, loadedList);
	//manageFiles(multiFile.files);
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

			//sort sprites by x-coordinates and y-coordinates for quicker lookup later
			metaArr.sort((a,b) => 
				(a.x > b.x) ? 1 :
				(b.x > a.x) ? -1 :
				(a.y > b.y) ? 1 :
				(b.y > a.y) ? -1 :
				0
			);

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




const spriteArea = byId("area1");
const sheet = byId("main-img");

