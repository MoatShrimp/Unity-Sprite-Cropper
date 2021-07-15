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
function downloadTest(sheet, metaArr, folderName) {
    const zip = new JSZip();
    const imageFolder = zip.folder(folderName);
    for (let i = 0; i < metaArr.length; ++i) {
        const current = metaArr[i];
        getSpriteCanvas(sheet, current).
            toBlob(blob => {
            imageFolder.file(`${current.name}.png`, blob);
            if (i + 1 === metaArr.length) {
                zip.generateAsync({ type: "blob" }).then((blob) => {
                    saveAs(blob, `${folderName}.zip`);
                });
            }
        });
    }
}
function quickDownload(sheet, metaArr, folderName) {
    const zipObj = {};
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(sheet, 0, 0);
    for (const sprite of metaArr) {
        const name = `${sprite.name}.png`;
        const file = new Uint8Array(ctx.getImageData(sprite.x, sprite.y, sprite.width, sprite.height).data.buffer);
        zipObj[name] = [file, { level: 0 }];
    }
    console.log(zipObj);
    fflate.zip(zipObj, {}, function (err, out) {
        const blob = new Blob([out], {
            type: "application/octet-stream"
        });
        console.log(blob);
        saveAs(blob, `${folderName}.zip`);
    });
}
function addNewFiles(files, pairs) {
    for (const file of Array.from(files)) {
        const name = file.name;
        const namepair = {
            img: file.name
        };
        if ((name.slice(-4).toLowerCase() === ".png") &&
            !(pairs.some(pair => { var _a; return ((_a = pair.img) === null || _a === void 0 ? void 0 : _a.name) === name; }))) {
            const index = pairs.findIndex(pair => { var _a; return ((_a = pair.meta) === null || _a === void 0 ? void 0 : _a.name.slice(0, -5)) === name; });
            if (index > -1) {
                pairs[index].img = file;
            }
            else {
                pairs.push({ img: file, meta: null });
            }
        }
        else if ((name.slice(-5).toLowerCase() === ".meta") &&
            !(pairs.some(pair => { var _a; return ((_a = pair.meta) === null || _a === void 0 ? void 0 : _a.name) === name; }))) {
            const index = pairs.findIndex(pair => { var _a; return ((_a = pair.img) === null || _a === void 0 ? void 0 : _a.name.slice(0, -4)) === name; });
            if (index > -1) {
                pairs[index].img = file;
            }
            else {
                pairs.push({ img: null, meta: file });
            }
        }
    }
    return pairs;
}
function updateFileList(pairs, list) {
    list.innerHTML = null;
    for (const pair of pairs) {
        const item = document.createElement("li");
        item.textContent = pair.img ? pair.img.name.slice(0, -4) : pair.meta.name.slice(0, -5);
        if (!pair.img) {
            item.title = "Missing image file";
            item.classList.add("missing-item");
        }
        else if (!pair.meta) {
            item.title = "Missing meta file";
            item.classList.add("missing-item");
        }
        list.appendChild(item);
    }
}
;
function sheetDb() { }
const mainDb = new sheetDb();
sheetDb.prototype.newSheet = function (img = null, meta = null) {
    return {
        imgFile: img,
        metaFile: meta,
        metaData: [],
        imageElement: null,
        selectElement: null,
        liElement: null
    };
};
sheetDb.prototype.readFileAsync = function (file, asDataUrl = true) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => { resolve(reader.result); };
        reader.onerror = reject;
        asDataUrl ? reader.readAsDataURL(file) : reader.readAsText(file);
    });
};
sheetDb.prototype.loadMeta = async function (key) {
    const sheet = this[key];
    if (!sheet.metaFile) {
        return null;
    }
    const metaDataStringified = await this.readFileAsync(sheet.metaFile, false);
    const metaEntries = metaDataStringified.split("name: ");
    const metaArr = [];
    for (let i = 1; i < metaEntries.length; ++i) {
        const allLines = metaEntries[i].split("\n");
        const meta = {
            name: allLines[0],
            x: parseInt(allLines[3].split("x: ")[1]),
            y: parseInt(allLines[4].split("y: ")[1]),
            width: parseInt(allLines[5].split("width: ")[1]),
            height: parseInt(allLines[6].split("height: ")[1])
        };
        metaArr.push(meta);
    }
    metaArr.sort((a, b) => (a.x > b.x) ? 1 :
        (b.x > a.x) ? -1 :
            (a.y > b.y) ? 1 :
                (b.y > a.y) ? -1 :
                    0);
    return metaArr;
};
sheetDb.prototype.loadImage = async function (key) {
    const sheet = this[key];
    if (!sheet.imgFile) {
        return null;
    }
    const image = new Image();
    image.src = await this.readFileAsync(sheet.imgFile, true);
    await image.decode();
    return image;
};
sheetDb.prototype.createLiElement = function (key) {
    const sheet = this[key];
    if (sheet.liElement) {
        return this;
    }
    const li = document.createElement("li");
    li.textContent = key;
    li.dataset.key = key;
    if (!sheet.imgFile) {
        li.title = "Missing image file";
        li.classList.add("missing-item");
    }
    else if (!sheet.metaFile) {
        li.title = "Missing meta file";
        li.classList.add("missing-item");
    }
    sheet.liElement = li;
    return this;
};
sheetDb.prototype.createAllLiElements = function () {
    Object.keys(this).forEach((key) => { this.createLiElement(key); });
    return this;
};
sheetDb.prototype.removeLiTitle = function (key) {
    const sheet = this[key];
    if (!sheet.liObject) {
        return this;
    }
    sheet.liObject.title = null;
    return this;
};
sheetDb.prototype.createSelectElement = function (key) {
    const sheet = this[key];
    const metaData = sheet.metaData;
    if (!metaData || sheet.selectElement) {
        return this;
    }
    const options = metaData.map((value, index) => new Option(value.name, index.toString()));
    options.sort((a, b) => (a.text > b.text) ? 1 :
        (a.text < b.text) ? -1 :
            0);
    const select = document.createElement("select");
    options.forEach(option => { select.add(option); });
    sheet.selectElement = select;
    return this;
};
sheetDb.prototype.addFiles = function (files) {
    const newSheet = this.newSheet;
    for (const file of Array.from(files)) {
        const name = file.name;
        const ext = name.slice((name.lastIndexOf(".") - 1 >>> 0) + 2);
        const isPng = (ext === "png");
        const isMeta = (ext === "meta");
        if (!(isPng || isMeta)) {
            continue;
        }
        if (isPng) {
            const key = name.slice(0, -4);
            if (this[key]) {
                if (this[key].imgFile) {
                    continue;
                }
                this[key].imgFile = file;
            }
            else {
                this[key] = newSheet(file, null);
            }
        }
        else {
            const key = name.slice(0, -9);
            if (this[key]) {
                if (this[key].metaFile) {
                    continue;
                }
                this[key].metaFile = file;
            }
            else {
                this[key] = newSheet(null, file);
            }
        }
    }
    this.createAllLiElements();
    return this;
};
sheetDb.prototype.addLiToUl = function (ulElement) {
    ulElement.innerHTML = null;
    Object.values(this).forEach((sheet) => { ulElement.appendChild(sheet.liElement); });
    return this;
};
sheetDb.prototype.loadAllData = function (sheetWrap, selectWrap, spriteWrap) {
    let notLoaded = true;
    const loadedSheet = sheetWrap.querySelector("img");
    for (const key of Object.keys(this)) {
        const sheet = this[key];
        if (sheet.imageElement || !(sheet.imgFile && sheet.metaFile)) {
            continue;
        }
        Promise.all([this.loadImage(key), this.loadMeta(key)]).then(([image, metaArr]) => {
            sheet.imageElement = image;
            sheet.metaData = metaArr;
            this.createSelectElement(key);
            if (!(loadedSheet === null || loadedSheet === void 0 ? void 0 : loadedSheet.src) && notLoaded) {
                notLoaded = false;
                this.loadSheetToDom(key, sheetWrap, selectWrap, spriteWrap);
            }
        });
    }
};
sheetDb.prototype.getFirstLoaded = function () {
    const foundSheet = Object.values(this).find((sheet) => sheet.imageElement);
    return foundSheet;
};
sheetDb.prototype.getSpriteCanvas = function (key, meta) {
    const sheet = this[key];
    if (!sheet.imageElement) {
        return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = meta.width;
    canvas.height = meta.height;
    const ctx = canvas.getContext('2d');
    const yInverted = sheet.imageElement.naturalHeight - (meta.y + meta.height);
    ctx.drawImage(sheet.imageElement, meta.x, yInverted, meta.width, meta.height, 0, 0, meta.width, meta.height);
    return canvas;
};
sheetDb.prototype.getSpriteCanvasFromSelect = function (key) {
    const sheet = this[key];
    if (!sheet.selectElement) {
        return;
    }
    const index = parseInt(sheet.selectElement.value);
    const meta = sheet.metaData[index];
    return this.getSpriteCanvas(key, meta);
};
sheetDb.prototype.getSpriteCanvasFromCoordinates = function (key, event) {
    const sheet = this[key];
    const image = sheet.imageElement;
    const offset = image.getBoundingClientRect();
    console.log(offset);
    const xScale = image.naturalWidth / offset.width;
    const yScale = image.naturalHeight / offset.height;
    const posX = Math.trunc((event.clientX - offset.x) * xScale);
    const posY = image.naturalHeight - Math.trunc((event.clientY - offset.y) * yScale);
    console.log(`${posX}.${posY}`);
    let meta = sheet.metaData.find(meta => posX >= meta.x &&
        posY >= meta.y &&
        posX <= meta.x + meta.width &&
        posY <= meta.y + meta.height);
    meta = meta !== null && meta !== void 0 ? meta : sheet.metaData[0];
    return this.getSpriteCanvas(key, meta);
};
sheetDb.prototype.loadSheetToDom = function (key, sheetWrap, selectWrap, spriteWrap) {
    const sheet = this[key];
    sheetWrap.innerHTML = null;
    sheetWrap.appendChild(sheet.imageElement);
    selectWrap.innerHTML = null;
    selectWrap.appendChild(sheet.selectElement);
    spriteWrap.innerHTML = null;
    spriteWrap.appendChild(this.getSpriteCanvasFromSelect(key));
};
function fileEvent(files, ul) {
    donwloadArrow.classList.add("move-arrow");
    setTimeout(() => { donwloadArrow.classList.remove("move-arrow"); }, 250);
    mainDb.addFiles(files)
        .addLiToUl(ul)
        .loadAllData(sheetWrap, selectWrap, spriteWrap);
    if (ul.childNodes.length && imageArea.classList.contains("image-area-unloaded")) {
        imageArea.classList.remove("image-area-unloaded");
    }
    else if (!(ul.childNodes.length || imageArea.classList.contains("image-area-unloaded"))) {
        imageArea.src = null;
        imageArea.classList.add("image-area-unloaded");
    }
}
const byQ = document.querySelector.bind(document);
const spriteWrap = byQ(".js-sprite-wrap");
const sheetWrap = byQ(".js-sheet-wrap");
const selectWrap = byQ(".js-select-wrap");
const fileUpload = byQ(".js-file-upload");
const fileList = byQ(".js-file-list");
const dropArea = byQ(".js-drop-area");
const imageArea = byQ(".js-image-area");
const donwloadArrow = byQ(".upload-arrow-top");
fileUpload.addEventListener("change", () => { fileEvent(fileUpload.files, fileList); });
const dAEvent = dropArea.addEventListener.bind(dropArea);
dAEvent("drop", (e) => { fileEvent(e.dataTransfer.files, fileList); });
dAEvent("click", () => { fileUpload.click(); });
const fLEvent = fileList.addEventListener.bind(fileList);
fLEvent('drop', (e) => { fileEvent(e.dataTransfer.files, fileList); });
fLEvent("click", (event) => {
    const clickedElement = event.target;
    if (clickedElement.tagName === "LI" && !(clickedElement.classList.contains("missing-item"))) {
        const key = clickedElement.dataset.key;
        mainDb.loadSheetToDom(key, sheetWrap, selectWrap, spriteWrap);
    }
});
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
    const key = "sactx-4096x2048-DXT5-VisualAtlas-67fa43af";
    spriteWrap.appendChild(mainDb.getSpriteCanvasFromCoordinates(key, event));
});
