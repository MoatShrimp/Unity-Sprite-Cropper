function fileEvent (files:FileList, ul:HTMLUListElement) {

    mainDb.addFiles(files)
        .addLiToUl(ul)
        .loadAllData(loadedSheet, spriteDropDown);

    if (ul.childNodes.length && imageArea.classList.contains("image-area-unloaded")) {
        imageArea.classList.remove("image-area-unloaded");
    }
    else if (!(ul.childNodes.length || imageArea.classList.contains("image-area-unloaded"))){
        imageArea.src = null;
        imageArea.classList.add("image-area-unloaded");
    }
}