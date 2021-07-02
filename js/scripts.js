"use strict";
const byId = document.getElementById.bind(document);
const byClass = document.getElementsByClassName.bind(document);
function getSpriteCanvas(sheet, spriteMeta) {
    const canvas = document.createElement("canvas");
    canvas.width = spriteMeta.width;
    canvas.height = spriteMeta.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(sheet, spriteMeta.x, spriteMeta.y, spriteMeta.width, spriteMeta.height, 0, 0, spriteMeta.width, spriteMeta.height);
    return canvas;
}
function getHoveredSpriteIndex(event, sheet, metaArr) {
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
const pairArr = [];
function manageFiles(files) {
    const oldLength = pairArr.length;
    const re = /(?:\.([^.]+))?$/;
    Array.from(files).forEach(file => {
        const name = file.name;
        const ext = re.exec(name)[1].toString();
        if (ext === "png" && !(pairArr.some(pair => { var _a; return ((_a = pair.img) === null || _a === void 0 ? void 0 : _a.name) === name; }))) {
            const index = pairArr.findIndex(pair => { var _a; return ((_a = pair.meta) === null || _a === void 0 ? void 0 : _a.name.slice(0, -5)) === name; });
            if (index > -1) {
                pairArr[index].img = file;
                let child = null;
                if (child = loadedList.childNodes[index + 1]) {
                    child.classList.remove("missing-item");
                }
            }
            else {
                pairArr.push({ img: file, meta: null });
            }
        }
        else if (ext === "meta" && !(pairArr.some(pair => { var _a; return ((_a = pair.meta) === null || _a === void 0 ? void 0 : _a.name) === name; }))) {
            const index = pairArr.findIndex(pair => { var _a; return ((_a = pair.img) === null || _a === void 0 ? void 0 : _a.name) === name.slice(0, -5); });
            if (index > -1) {
                pairArr[index].meta = file;
                let child = null;
                if (child = loadedList.childNodes[index + 1]) {
                    child.classList.remove("missing-item");
                }
            }
            else {
                pairArr.push({ img: null, meta: file });
            }
        }
    });
    for (let i = oldLength; i < pairArr.length; ++i) {
        const item = document.createElement("li");
        let missingFlag = false;
        let name = null;
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
        if (name.length > 30) {
            const start = name.slice(0, 20);
            const end = name.slice(-15);
            name = `${start}...${end}`;
        }
        if (missingFlag) {
            item.classList.add("missing-item");
        }
        item.textContent = name;
        loadedList.appendChild(item);
    }
}
const spriteDropDown = byId("sprite-selection");
const selectedSprite = byId("loaded-sprite");
const loadedSheet = byId("loaded-sprite-sheet");
const reloadBtn = byId("reload-button");
const hover = byId("hover");
const cont = byId("cont");
let metaArr = null;
let currentSpriteIndex = 0;
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
const dropArea = byId('drop-area');
const multiFile = byId('fileElem');
const loadedList = byId('loaded-list');
const donwloadArrow = byClass("upload-top")[0];
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
    loadedList.addEventListener(eventName, function (e) {
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
    donwloadArrow.classList.add("top-10");
    setTimeout(() => { donwloadArrow.classList.remove("top-10"); }, 250);
    manageFiles(e.dataTransfer.files);
});
multiFile.addEventListener("change", () => {
    manageFiles(multiFile.files);
});
dropArea.addEventListener("click", () => {
    multiFile.click();
});
loadedList.addEventListener("click", (event) => {
    const clickedElement = event.target;
    if (clickedElement.tagName === "LI" && !(clickedElement.classList.contains("missing-item"))) {
        const index = Array.from(loadedList.children).indexOf(clickedElement);
        const currentPair = pairArr[index];
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target.result) {
                loadedSheet.src = e.target.result;
            }
        };
        reader.readAsDataURL(currentPair.img);
        const metareader = new FileReader();
        metareader.onload = (e) => {
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
        metareader.readAsText(currentPair.meta);
    }
});
