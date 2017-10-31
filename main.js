MYAPP = {
  fileReader () {
    const fileList = document.getElementById("fileList");
    // Check for the various file API support
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // All the file APIs are supported
      fileList.addEventListener("change", () => {MYAPP.handleFiles(fileList);}, false);
    } else {
      alert('The File APIs are not fully supported in this browser.');
    }
  },

  handleFiles(fileList) {
    // Get the elements inside of which we will output some kind of data (aka parents)
    const parentElements = {
      numFiles : document.getElementById("numFiles"),
      fileData : document.getElementById("fileData")
    }
    // Clear parents
    MYAPP.clearOutputs(parentElements);
    // Output number of files
    parentElements.numFiles.appendChild(document.createTextNode(`${fileList.files.length}`));
    // Output files
    for (const file of fileList.files) {
      const parentElement = document.createElement("article"), reader = new FileReader();
      // Append metadata
      parentElement.appendChild(MYAPP.fileMetadataOutput(file));
      // Append data
      reader.onload = (event) => {
        const rawText = event.target.result;
        parentElement.appendChild(MYAPP.textOutput(rawText));
      };
      reader.onerror = (event) => {
        alert(event.target.error.name);
      };
      reader.readAsText(file);
      // Append file
      parentElements.fileData.appendChild(parentElement);
    }
  },

  clearOutputs({fileData, numFiles} = {}) {
    numFiles.textContent = "";
    while (fileData.firstChild) {
      fileData.removeChild(fileData.firstChild);
    }
  },

  fileMetadataOutput ({name, size, type}) {
    // TODO update the way metadata (name, size and type) is being displayed
    const metadataString = JSON.stringify({name, size, type});
    return MYAPP.textOutput(metadataString);
  },

  textOutput (text) {
    const newParentElement = document.createElement("pre");
    newParentElement.appendChild(document.createTextNode(`${text}`));
    return newParentElement;
  }
}

window.addEventListener("load", MYAPP.fileReader, false);
