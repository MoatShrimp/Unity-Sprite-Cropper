function updateFileList(pairs:FilePair[], list:HTMLUListElement) {

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