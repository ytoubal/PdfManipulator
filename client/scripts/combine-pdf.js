var pdfList = new Array();

function onCombinePdf() {
 var formData = new FormData();
 var file = {};
 for (const pdf of pdfList) {
     file = {
          'index': pdf.index,
          'name': pdf.name,
          'path': pdf.path,
     }
     formData.append("pdf[]", JSON.stringify(file));
 }
 console.log(formData.getAll("pdf[]"));

 fetch("http://localhost:3000/", {
   method: "POST",
   body: formData,
 })
   .then((response) => {
         response.blob().then(function (blob) {
             const mergedPdfUrl = window.URL.createObjectURL(blob);
             downloadPdf(mergedPdfUrl);   
         }); 
   });
}

function onFileInputChange() {
    var pdfAddedList = document.getElementById('pdfs_selected').files;
    const pdfListWrapper = document.getElementById("filesList");
    for (const pdf of pdfAddedList) {
        pdf.index = pdfList.length;
        pdfList.push(pdf);
        const pdfListElem = document.createElement("li")
        pdfListElem.className = "list-group-items";
        pdfListElem.innerHTML = pdf.name;
        const button = document.createElement('button');
        button.className = "deleteFileButton";
        button.innerHTML =
          '<span><i class="fa fa-trash"></i></span>';
        button.addEventListener("click", function() {onDeleteFile(pdf.index)});
        pdfListElem.append(button);
        pdfListWrapper.append(pdfListElem);
    }
    document.getElementById("pdfs_selected").value = "";
}

function downloadPdf(url) {
  var a = document.createElement("a");
  a.href = url;
  const filename = "merged.pdf";
  a.setAttribute("download", filename);
  a.click();
  delete a;
}

function onDeleteFile(fileIndex) {
    pdfList.splice(fileIndex, 1);
    const pdfListWrapper = document.getElementById("filesList");
    pdfListWrapper.innerHTML = "";
    for (const pdf of pdfList) {
      pdfListWrapper.append(createPdfListElem(pdf, fileIndex)); 
    }
    document.getElementById("pdfs_selected").value = "";
}

function createPdfListElem(pdf, index=pdfList.length) {
    if (pdf.index > index) {
        pdf.index = pdf.index - 1;
    }
    const pdfListElem = document.createElement("li");
    pdfListElem.className = "list-group-items";
    pdfListElem.innerHTML = pdf.name;
    const button = document.createElement("button");
    button.className = "deleteFileButton";
    button.innerHTML = '<span><i class="fa fa-trash"></i></span>';
    button.addEventListener("click", function() {
    onDeleteFile(pdf.index)});
    pdfListElem.append(button);
    return pdfListElem;
}

function onResetFiles() {
    pdfList = new Array();
    document.getElementById("filesList").innerHTML = '';
    onFileInputChange();
}