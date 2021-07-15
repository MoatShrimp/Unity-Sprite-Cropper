"use strict";
const byId = document.getElementById.bind(document);
const byClass = document.getElementsByClassName.bind(document);
function ofId(name) {
    function func() {
        return document.getElementById(name);
    }
    return func;
}
const adam = (name => ofId(name));
function convertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
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
function loadData(pairs, loaded) {
    for (const pair of pairs) {
        if (pair.img && pair.meta && !(loaded.some(entry => entry.name === pair.img.name))) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target.result) {
                    const src = e.target.result;
                    quickReader(pair.meta).then(value => {
                        let meta = value;
                        meta.sort((a, b) => (a.x > b.x) ? 1 :
                            (b.x > a.x) ? -1 :
                                (a.y > b.y) ? 1 :
                                    (b.y > a.y) ? -1 :
                                        0);
                        loaded.push({
                            name: pair.img.name,
                            img: src,
                            meta: meta
                        });
                    });
                }
            };
            reader.readAsDataURL(pair.img);
        }
    }
    return loaded;
}
const pairArr = [];
const loaded = [];
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
                loaded.push(pairArr[index]);
                let child = null;
                if (child = loadedList.childNodes[index + 1]) {
                    child.classList.remove("missing-item");
                    child.title = "";
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
                loaded.push(pairArr[index]);
                let child = null;
                if (child = loadedList.childNodes[index + 1]) {
                    child.classList.remove("missing-item");
                    child.title = "";
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
                item.title = "Missing meta file";
            }
        }
        else {
            name = pairArr[i].meta.name.slice(0, -9);
            missingFlag = true;
            item.title = "Missing image file";
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
    if (loaded.length) {
        imageArea.classList = ["image-area-loaded"];
    }
}
;
function sheetDb() { }
const mainDb = new sheetDb();
sheetDb.prototype.newSheet = function (img = null, meta = null) {
    return {
        imgFile: img,
        metaFile: meta,
        imgData: null,
        metaData: [],
        imageElement: null,
        selectElement: null,
        liElement: null
    };
};
sheetDb.prototype.loadMeta = async function (key) {
    const sheet = this[key];
    if (!sheet.metaFile) {
        return null;
    }
    function readFileAsync(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => { resolve(reader.result); };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
    const input = await readFileAsync(sheet.metaFile);
    const spriteList = input.split("name: ");
    const metaArr = [];
    for (let i = 1; i < spriteList.length; ++i) {
        const allLines = spriteList[i].split("\n");
        const meta = {
            name: allLines[0],
            x: parseInt(allLines[3].split("x: ")[1]),
            y: parseInt(allLines[4].split("y: ")[1]),
            width: parseInt(allLines[5].split("width: ")[1]),
            height: parseInt(allLines[6].split("height: ")[1])
        };
        meta.y = sheet.imageElement.height - (meta.y + meta.height);
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
    function readFileAsync(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => { resolve(reader.result); };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    const imageSrc = await readFileAsync(sheet.imgFile);
    sheet.imgData = imageSrc;
    const image = new Image();
    image.classList.add("js-sheet-image");
    image.src = imageSrc;
    await image.decode();
    return image;
};
sheetDb.prototype.createLiElement = function (key) {
    const sheet = this[key];
    if (sheet.liElement) {
        return this;
    }
    const item = document.createElement("li");
    item.textContent = key;
    item.dataset.key = key;
    if (!sheet.imgFile) {
        item.title = "Missing image file";
    }
    else if (!sheet.metaFile) {
        item.title = "Missing meta file";
    }
    sheet.liElement = item;
    return this;
};
sheetDb.prototype.createAllLiElements = function () {
    for (const key of Object.keys(this)) {
        this.createLiElement(key);
    }
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
    select.classList.add("js-meta-select");
    options.forEach(option => { select.add(option); });
    this[key].selectElement = select;
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
    for (const key of Object.keys(this)) {
        ulElement.appendChild(this[key].liElement);
    }
    return this;
};
sheetDb.prototype.loadAllData = function (display, select) {
    for (const key of Object.keys(this)) {
        const sheet = this[key];
        if (sheet.imgData || !(sheet.imgFile && sheet.metaFile)) {
            continue;
        }
        this.loadImage(key).then(image => {
            sheet.imageElement = image;
            this.loadMeta(key).then(metaArr => {
                sheet.metaData = metaArr;
                this.createSelectElement(key);
            });
        });
    }
};
sheetDb.prototype.getFirstLoaded = function () {
    const foundKey = Object.keys(this).find(key => this[key].imgData);
    return this[foundKey];
};
sheetDb.prototype.getSpriteCanvasFromSelect = function (key, meta) {
    const sheet = this[key];
    if (!sheet.imageElement) {
        return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = meta.width;
    canvas.height = meta.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(sheet.imageElement, meta.x, meta.y, meta.width, meta.height, 0, 0, meta.width, meta.height);
    return canvas;
};
sheetDb.prototype.getSpriteCanvasFromSelect = function (key) {
    const sheet = this[key];
    if (!sheet.selectElement) {
        return;
    }
    const index = parseInt(sheet.selectElement.value);
    const meta = sheet.metaDataAlphaDecending[index];
    return this.getSpriteCanvas(key, meta);
};
sheetDb.prototype.getSpriteCanvasFromCoordinates = function (key, x, y) {
    const sheet = this[key];
    const meta = sheet.metaData.find(meta => {
        x >= meta.x &&
            y >= meta.y &&
            x <= meta.x + meta.width &&
            y <= meta.y + meta.height;
    });
    return this.getSpriteCanvas(key, meta);
};
sheetDb.prototype.loadSheetToDom = function (key, sheetArea, spriteSelect, spriteCanvasArea) {
    const sheet = this[key];
    const newImage = sheet.imageElement;
    sheetArea.parentNode.replaceChild(newImage, sheetArea);
    sheetArea = newImage;
    const newSelect = sheet.selectElement;
    spriteSelect.parentNode.replaceChild(newSelect, spriteSelect);
    spriteSelect = newSelect;
    spriteCanvasArea.innerHTML = null;
    spriteCanvasArea.appendChild(this.getSpriteCanvasFromSelect(key));
};
function fileEvent(files, ul) {
    mainDb.addFiles(files)
        .addLiToUl(ul)
        .loadAllData(loadedSheet, spriteDropDown);
    if (ul.childNodes.length && imageArea.classList.contains("image-area-unloaded")) {
        imageArea.classList.remove("image-area-unloaded");
    }
    else if (!(ul.childNodes.length || imageArea.classList.contains("image-area-unloaded"))) {
        imageArea.src = null;
        imageArea.classList.add("image-area-unloaded");
    }
}
async function quickReader(file) {
    function readFileAsync(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
    const input = await readFileAsync(file);
    const spriteList = input.split("name: ");
    const output = [];
    for (let i = 1; i < spriteList.length; ++i) {
        const allLines = spriteList[i].split("\n");
        const meta = {
            name: allLines[0],
            x: parseInt(allLines[3].split("x: ")[1]),
            y: parseInt(allLines[4].split("y: ")[1]),
            width: parseInt(allLines[5].split("width: ")[1]),
            height: parseInt(allLines[6].split("height: ")[1])
        };
        meta.y = loadedSheet.naturalHeight - (meta.y + meta.height);
        output.push(meta);
    }
    return output;
}
const spriteDropDown = byId("sprite-selection");
const selectedSprite = byId("sprite-canvas-wrap");
const loadedSheet = byId("loaded-sprite-sheet");
const reloadBtn = byId("reload-button");
const cont = byId("cont");
const imageArea = byId("image-area");
let metaArr = null;
let currentSpriteIndex = 0;
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
const dropArea = byId('drop-area');
const multiFile = byId('file-upload');
const loadedList = byId('loaded-list');
const donwloadArrow = byClass("upload-arrow-top")[0];
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
    fileEvent(e.dataTransfer.files, loadedList);
});
loadedList.addEventListener('drop', (e) => {
    donwloadArrow.classList.add("move-arrow");
    setTimeout(() => { donwloadArrow.classList.remove("move-arrow"); }, 250);
    fileEvent(e.dataTransfer.files, loadedList);
});
multiFile.addEventListener("change", () => {
    fileEvent(multiFile.files, loadedList);
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
        quickReader(currentPair.meta).then(value => {
            metaArr = value;
            metaArr.sort((a, b) => (a.x > b.x) ? 1 :
                (b.x > a.x) ? -1 :
                    (a.y > b.y) ? 1 :
                        (b.y > a.y) ? -1 :
                            0);
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
