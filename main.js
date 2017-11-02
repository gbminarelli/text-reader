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
    // Clear parents from previous outputs
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
        parentElement.appendChild(MYAPP.appendData("pre", rawText));
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
    const nameElement = MYAPP.appendData("h3", name);
    const sizeElement = MYAPP.appendData("p", `File size : ${size}`);
    const typeElement = MYAPP.appendData("p", `File type : ${type}`);
    return MYAPP.appendData("header", nameElement, sizeElement, typeElement);
  },

  appendData (parentElementTag, ...dataArray) {
    const newParentElement = document.createElement(`${parentElementTag}`);
    for (data of dataArray) {
      // Check if data is an Element by cheking the tagName property value
      if (data.tagName) {
        newParentElement.appendChild(data);
      } else {
        newParentElement.appendChild(document.createTextNode(`${data}`));
      }
    }
    return newParentElement;
  }
}

window.addEventListener("load", MYAPP.fileReader, false);
