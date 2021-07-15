const byQ = document.querySelector.bind(document);
const spriteWrap:HTMLDivElement = byQ(".js-sprite-wrap");
const sheetWrap:HTMLDivElement = byQ(".js-sheet-wrap");
const selectWrap:HTMLSpanElement = byQ(".js-select-wrap");
const fileUpload:HTMLInputElement = byQ(".js-file-upload");
const fileList:HTMLUListElement = byQ(".js-file-list");
const dropArea:HTMLFormElement = byQ(".js-drop-area");
const imageArea:HTMLFormElement = byQ(".js-image-area");
const donwloadArrow:HTMLImageElement = byQ(".upload-arrow-top");

//fileUpload input events
fileUpload.addEventListener("change", () => {	fileEvent(fileUpload.files, fileList);	});
//dropArea events, alias dAEvent
const dAEvent = dropArea.addEventListener.bind(dropArea); 
dAEvent("drop", (e) => {	fileEvent(e.dataTransfer.files, fileList);	});
dAEvent("click", () => {	fileUpload.click();	});

//fileList events, alias fLEvent
const fLEvent = fileList.addEventListener.bind(fileList); 
fLEvent('drop', (e) => {	fileEvent(e.dataTransfer.files, fileList);});

fLEvent("click", (event) => {
	const clickedElement = <HTMLElement>event.target;
	if (clickedElement.tagName === "LI" && !(clickedElement.classList.contains("missing-item"))) {
		const key = clickedElement.dataset.key;
		mainDb.loadSheetToDom(key, sheetWrap, selectWrap, spriteWrap);
	}
});

//drag-and-drop events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
	dAEvent(eventName, (e) => {
		e.preventDefault();
		e.stopPropagation();
	});
	fLEvent(eventName, (e) => {
		e.preventDefault();
		e.stopPropagation();
	});
});

['dragenter', 'dragover'].forEach(eventName => {
	dAEvent(eventName, () => {
		dropArea.classList.add('highlight');
	});
});

['dragleave', 'drop'].forEach(eventName => {
	dAEvent(eventName, () => {
		dropArea.classList.remove('highlight');
	});
});

sheetWrap.addEventListener("mousemove", event => {
	spriteWrap.innerHTML = null;
	const key = "sactx-4096x2048-DXT5-VisualAtlas-67fa43af"
    spriteWrap.appendChild(mainDb.getSpriteCanvasFromCoordinates(key, event));
});





