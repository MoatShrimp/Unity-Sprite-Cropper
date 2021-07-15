sheetDb.prototype.addLiToUl = function (ulElement:HTMLUListElement) {

    ulElement.innerHTML = null;    

    for (const key of Object.keys(this)) {
        ulElement.appendChild(this[key].liElement);
    }

    return this;
}