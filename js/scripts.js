"use strict";
const e$ = (name) => document.getElementById(name);
var trial = null;
function loadMeta(meta) {
    const metaData = YAML.parse(meta);
    return metaData;
}
const getImage = e$("image-file-input");
const getMeta = e$("meta-file-input");
const spriteSelection = e$("sprite-selection");
const metaInfo = e$("meta-info");
const result = e$("result");
const outputDiv = e$("output");
const cropped = e$("cropped");
const canvas = document.getElementById('output');
let cropper = null;
let img = null;
const dataEvent = new Event("change");
spriteSelection.style.display = "none";
getImage.addEventListener("change", () => {
    if (getImage.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target.result) {
                img = document.createElement('img');
                img.id = 'image';
                img.src = e.target.result;
                result.innerHTML = '';
                result.appendChild(img);
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
                let one = loadMeta(e.target.result).TextureImporter.spriteSheet.sprites;
                trial = one.map(sprite => {
                    const meta = sprite.rect;
                    const x = sprite.rect.x;
                    return {
                        name: sprite.name,
                        height: parseInt(meta.height),
                        width: parseInt(meta.width),
                        x: parseInt(meta.x),
                        y: img.naturalHeight - parseInt(meta.y + meta.height)
                    };
                });
                trial.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
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
    trialCrop();
});
function trialCrop() {
    canvas.style.display = "block";
    const currentSprite = trial[spriteSelection.value];
    canvas.width = currentSprite.width;
    canvas.height = currentSprite.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, currentSprite.x, currentSprite.y, currentSprite.width, currentSprite.height, 0, 0, currentSprite.width, currentSprite.height);
}
