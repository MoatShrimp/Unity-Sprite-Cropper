//define dom elements
const spriteDropDown:HTMLSelectElement = byId("sprite-selection");
const selectedSprite:HTMLDivElement = byId("sprite-canvas-wrap");
const loadedSheet:HTMLImageElement = byId("loaded-sprite-sheet");
const reloadBtn:HTMLButtonElement = byId("reload-button");
const cont:HTMLDivElement = byId("cont");

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



const imageArea = byId("image-area");
const spriteArea = byId("area1");
const sheet = byId("main-img");
let move = false;
let stopping = true;

const drag = byId("drag-up-down");
let yCoor = null;

imageArea.addEventListener("mousemove", (event) => {
    yCoor = event.clientY;
});

function movingLoop(startY) {

	const current = yCoor
	const min = 200;
	const max = document.documentElement.clientHeight - min - (min/2);

	if (yCoor > min && yCoor < max) {
		const oldHeigth = 
			getComputedStyle(document.documentElement)
				.getPropertyValue('--top-height')
					.slice(0, -2);

		const delta = startY - current;
		let newHeight = parseInt(oldHeigth) - delta;
		newHeight =  
			newHeight > min && newHeight < max ? newHeight :
			newHeight > min ? max :
			min;

		document.documentElement.style.setProperty('--top-height', `${newHeight}px`);
		document.documentElement.style.setProperty('--bottom-height',
			`${document.documentElement.clientHeight - newHeight -150}px`);
	}
	if (stopping === false) {
		requestAnimationFrame(() => {movingLoop(current)});
	}
}

let trialInt = null;
drag.addEventListener("mousedown", event => {
	stopping = false;
	trialInt = window.requestAnimationFrame(() => {movingLoop(event.clientY);});	
});

document.addEventListener("mouseup", () => {
	stopping = true;
});