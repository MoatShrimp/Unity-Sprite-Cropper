function fileEvent (files:FileList, ul:HTMLUListElement) {

    donwloadArrow.classList.add("move-arrow");
	setTimeout(() => {  donwloadArrow.classList.remove("move-arrow"); }, 250);

    mainDb.addFiles(files)
        .addLiToUl(ul)
        .loadAllData(sheetWrap, selectWrap, spriteWrap);

    if (ul.childNodes.length && imageArea.classList.contains("image-area-unloaded")) {
        imageArea.classList.remove("image-area-unloaded");
        
    }
    else if (!(ul.childNodes.length || imageArea.classList.contains("image-area-unloaded"))){
        imageArea.src = null;
        imageArea.classList.add("image-area-unloaded");
    }
}