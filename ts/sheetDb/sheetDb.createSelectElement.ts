sheetDb.prototype.createSelectElement = function (this:SheetDB, key:string) {

    const sheet:Sheet = this[key];
    const metaData = sheet.metaData;

    if(!metaData || sheet.selectElement) {   return this;  }

    const options = metaData.map((value, index) => new Option( value.name, index.toString() ));
    //sort options array alphabetically for ease-of-access
    options.sort( (a,b) => 
        (a.text > b.text) ? 1:
        (a.text < b.text) ? -1:
        0
    )

    const select = document.createElement("select");
    options.forEach(option => { select.add(option); });
    sheet.selectElement = select;

    return this;
}