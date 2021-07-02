"use strict";
const byId = document.getElementById.bind(document);
function getSpriteCanvas(sheet, spriteMeta) {
    const canvas = document.createElement("canvas");
    canvas.width = spriteMeta.width;
    canvas.height = spriteMeta.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(sheet, spriteMeta.x, spriteMeta.y, spriteMeta.width, spriteMeta.height, 0, 0, spriteMeta.width, spriteMeta.height);
    return canvas;
}
function getClickedSpriteIndex(event, sheet, metaArr) {
    const offset = sheet.getBoundingClientRect();
    const xScale = sheet.naturalWidth / offset.width;
    const yScale = sheet.naturalHeight / offset.height;
    const clickX = Math.trunc((event.clientX - offset.x) * xScale);
    const clickY = Math.trunc((event.clientY - offset.y) * yScale);
    const spriteIndex = metaArr.findIndex(sprite => clickX >= sprite.x &&
        clickY >= sprite.y &&
        clickX <= sprite.x + sprite.width &&
        clickY <= sprite.y + sprite.height);
    return spriteIndex;
}
function downloadSprite(sheet, spriteMeta) {
    const dataUrl = getSpriteCanvas(sheet, spriteMeta).
        toDataURL();
    saveAs(dataUrl, `${spriteMeta.name}.zip`);
}
function downloadAllSprites(sheet, metaArr, folderName) {
    let spriteCollection = [];
    for (const spriteMeta of metaArr) {
        const dataUrl = getSpriteCanvas(sheet, spriteMeta).
            toDataURL("image/png").
            replace(/^data:image\/(png|jpg);base64,/, "");
        spriteCollection.push({ name: spriteMeta.name, data: dataUrl });
    }
    const zip = new JSZip();
    const imageFolder = zip.folder(folderName);
    for (const image of spriteCollection) {
        imageFolder.file(`${image.name}.png`, image.data, { base64: true });
    }
    zip.generateAsync({ type: "blob" }).then((blob) => {
        saveAs(blob, `${folderName}.zip`);
    });
}
function canvasToBlob(canvas) {
    return new Promise(resolve => canvas.toBlob(resolve));
}
async function newD(sheet, metaArr, folderName) {
    const zip = new JSZip();
    const imageFolder = zip.folder(folderName);
    for (const spriteMeta of metaArr) {
        imageFolder.file(`${spriteMeta.name}.png`, await new Promise(resolve => getSpriteCanvas(sheet, spriteMeta).toBlob(resolve)));
    }
    zip.generateAsync({ type: "blob" }).then((blob) => {
        saveAs(blob, `${folderName}.zip`);
    });
}
const inputArea = byId("file-input");
const imageInput = byId("image-file-input");
const metaInput = byId("meta-file-input");
const spriteDropDown = byId("sprite-selection");
const selectedSprite = byId("loaded-sprite");
const loadedSheet = byId("loaded-sprite-sheet");
const reloadBtn = byId("reload-button");
var metaArr = null;
const dataEvent = new Event("change");
inputArea.addEventListener("change", () => {
    if (imageInput.files[0] && metaInput.files[0]) {
        if (metaInput.files[0].name.slice(0, -5) === imageInput.files[0].name) {
            const metaFile = metaInput.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const rawMeta = YAML.parse(e.target.result).TextureImporter.spriteSheet.sprites;
                metaArr = rawMeta.map(sprite => {
                    const meta = sprite.rect;
                    return {
                        name: sprite.name,
                        height: parseInt(meta.height),
                        width: parseInt(meta.width),
                        x: parseInt(meta.x),
                        y: loadedSheet.naturalHeight - parseInt(meta.y + meta.height)
                    };
                });
                metaArr.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
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
        reader.onload = (e) => {
            if (e.target.result) {
                loadedSheet.src = e.target.result;
            }
        };
        reader.readAsDataURL(imageInput.files[0]);
    }
});
reloadBtn.addEventListener("click", () => {
    imageInput.dispatchEvent(dataEvent);
    inputArea.dispatchEvent(dataEvent);
});
