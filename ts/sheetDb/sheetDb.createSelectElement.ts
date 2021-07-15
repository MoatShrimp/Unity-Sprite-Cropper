sheetDb.prototype.createSelectElement = function (key) {

    const sheet = this[key];
    const metaData:Meta[] = sheet.metaData;

    if(!metaData || sheet.selectElement) {   return this;  }    

    const options = metaData.map((value, index) => new Option( value.name, index.toString() ));

    //sort options alphabetical
    options.sort( (a,b) => 
        (a.text > b.text) ? 1:
        (a.text < b.text) ? -1:
        0
    )

    const select = document.createElement("select");
    select.classList.add("js-meta-select");
    options.forEach(option => { select.add(option)    });
    this[key].selectElement = select;

    return this;
}