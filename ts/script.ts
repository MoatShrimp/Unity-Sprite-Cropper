declare var YAML: any;
declare var JSZip: any;
declare var saveAs: any;

const e$ = (name: string):any => document.getElementById(name);
var trial = null;
function loadMeta(meta:string) {
	
	//const metaData = yaml.load(meta);
	const metaData = YAML.parse(meta);
	return metaData;
}

const getImage:HTMLInputElement = e$("image-file-input");
const getMeta:HTMLInputElement = e$("meta-file-input");
const spriteSelection:HTMLSelectElement = e$("sprite-selection");
const metaInfo:HTMLDivElement = e$("meta-info");
const mouseInfo:HTMLDivElement = e$("mouse-info");
const result:HTMLDivElement = e$("result");
const outputDiv:HTMLDivElement = e$("output");
const cropped:HTMLImageElement = e$("cropped");
const mainImg:HTMLImageElement = e$("image");
const canvas:HTMLCanvasElement =  e$('output');

let cropper = null;
let img = null;

const dataEvent = new Event("change");
spriteSelection.style.display = "none";

mainImg.addEventListener("click", (e) => {
	const offset = mainImg.getBoundingClientRect()
	const xMulti = mainImg.naturalWidth / offset.width;
	const yMulti = mainImg.naturalHeight / offset.height;
	const x = Math.trunc((e.clientX - offset.x) * xMulti);
    const y = Math.trunc((e.clientY - offset.y) * yMulti);

	const clickedSprite = trial.findIndex(sprite => x >= sprite.x && x <= sprite.x + sprite.width && y >= sprite.y && y <= sprite.y + sprite.height);
	mouseInfo.innerHTML = null;
	mouseInfo.innerHTML = `your current position is [${x}, ${y}] and you clicked ${trial[clickedSprite]}`;
	spriteSelection.value = clickedSprite;
	spriteSelection.dispatchEvent(dataEvent);
});



getImage.addEventListener("change", () => {
	if (getImage.files[0]) {

		const reader = new FileReader();

		reader.onload = (e)=> {
			if(e.target.result){
				mainImg.src = <string>e.target.result;
				result.innerHTML = '';
			  	result.appendChild(mainImg);
				//cropper = new Cropper(img);
			}
		};
		reader.readAsDataURL(getImage.files[0]);
	}
});

e$("load-data").addEventListener("change", () => {

	if (getImage.files[0] && getMeta.files[0]) {

		if (getMeta.files[0].name.slice(0, -5) === getImage.files[0].name) {
			const metaFile = getMeta.files[0];
			const reader = new FileReader();
			
			reader.onload = (e) => {
				let one = loadMeta(<string>e.target.result).TextureImporter.spriteSheet.sprites;
				trial = one.map(sprite => {
					const meta = sprite.rect;
					const x = sprite.rect.x;
					return {
						name:sprite.name,
						height:parseInt(meta.height), 
						width:parseInt(meta.width),
						x:parseInt(meta.x),
						y:mainImg.naturalHeight - parseInt(meta.y + meta.height)
					};
				});

				trial.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))

				metaInfo.innerHTML = null;
				spriteSelection.innerHTML = null;
				for (const index in trial) {
					const selection = document.createElement("option");
					selection.value = index;
					selection.text = trial[index].name;
					spriteSelection.add(selection);
				}
				spriteSelection.style.display = "block";
				spriteSelection.dispatchEvent(dataEvent);
			};
			reader.readAsText(metaFile);
		}
		else {
			console.log("files not matching");
			spriteSelection.style.display = "none";
			canvas.style.display = "none";

		}
	}
});

e$("reload-button").addEventListener("click", () => {
	getImage.dispatchEvent(dataEvent);
	e$("load-data").dispatchEvent(dataEvent);
});

spriteSelection.addEventListener("change", () => {
	metaInfo.innerHTML = null;
	const currentSprite = trial[spriteSelection.value];
	metaInfo.innerHTML = 
		`Name: ${currentSprite.name}<br>
		 Coordinates: [x: ${currentSprite.x}, y: ${currentSprite.y}]<br>
		 Size: [Height: ${currentSprite.height}px, width: ${currentSprite.width}px]`;
	trialCrop ();
});

function trialCrop () {
	canvas.style.display = "block";
	const currentSprite = trial[spriteSelection.value];	
	canvas.width = currentSprite.width;
	canvas.height = currentSprite.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(
		mainImg,
		currentSprite.x,
		currentSprite.y,
		currentSprite.width,
		currentSprite.height,
		0,
		0,
		currentSprite.width,
		currentSprite.height
	);
}

function downloadAll() {
	let spriteCollection = [];
	const folderName = getImage.files[0].name.slice(0, -4);
	for (const sprite of trial) {
		const canvas = document.createElement("canvas");
		canvas.width = sprite.width;
		canvas.height = sprite.height;
		const ctx = canvas.getContext("2d");
		ctx.drawImage(
			mainImg,
			sprite.x,
			sprite.y,
			sprite.width,
			sprite.height,
			0,
			0,
			sprite.width,
			sprite.height
		);
		let dataURL = canvas.toDataURL("image/png");
		spriteCollection.push({name:sprite.name, data:dataURL.replace(/^data:image\/(png|jpg);base64,/, "")});
	}

	const zip = new JSZip();
	const images = zip.folder(folderName);

	for (const image of spriteCollection) {
		images.file(`${image.name}.png`, image.data, {base64:true});
	}

	zip.generateAsync({type:"blob"}).then( (blob) => {
			saveAs(blob, `${folderName}.zip`);
		});

}

function getBase64Image() {
	const currentSprite = trial[spriteSelection.value];	
	const canvas = document.createElement("canvas");
	canvas.width = currentSprite.width;
	canvas.height = currentSprite.height;
	const ctx = canvas.getContext("2d");
	ctx.drawImage(
		mainImg,
		currentSprite.x,
		currentSprite.y,
		currentSprite.width,
		currentSprite.height,
		0,
		0,
		currentSprite.width,
		currentSprite.height
	);
	return canvas.toDataURL("image/png");
}