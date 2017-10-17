MYAPP = {
  fileReader () {
    const fileList = document.getElementById("fileList");
    // check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // all the File APIs are supported.
      fileList.addEventListener("change", () => MYAPP.handleFiles(fileList), false);
    } else {
      alert('The File APIs are not fully supported in this browser.');
    }
  },

  handleFiles(fileList) {
    const parentElements = {
      numFiles : document.getElementById("numFiles"),
      fileData : document.getElementById("fileData")
    }
    MYAPP.clearOutputs(parentElements);
    MYAPP.textOutput({data : fileList.files.length, element : parentElements.numFiles});
    for (const file of fileList.files) {
      MYAPP.fileDataOutput({data : file, parentElement : parentElements.fileData});
    }
  },

  fileDataOutput ({data = "", parentElement = null} = {}) {
    const {name, size, type} = data, newParentElement = document.createElement("div");
    parentElement.appendChild(newParentElement);
    MYAPP.fileMetadataOutput({data : {name, size, type}, parentElement : newParentElement});
    MYAPP.getFileContent({data, parentElement : newParentElement});
  },

  fileMetadataOutput ({data = "", parentElement = null} = {}) {
    const metadataString = JSON.stringify(data);
    MYAPP.fileOutput({data : metadataString, parentElement});
  },

  getFileContent ({data = "", parentElement = null} = {}) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawText = event.target.result, textLines = rawText.split(/\r\n|\n/);
      textLines.map((line) => {
        MYAPP.fileOutput({data : line, parentElement});
      });
    };
    reader.onerror = (event) => {
      alert(event.target.error.name);
    };
    reader.readAsText(data);
  },

  clearOutputs({fileData, numFiles} = {}) {
    numFiles.textContent = "";
    while (fileData.firstChild) {
      fileData.removeChild(fileData.firstChild);
    }
  },

  fileOutput ({data = "", parentElement = null} = {}) {
    const newParentElement = document.createElement("div");
    parentElement.appendChild(newParentElement);
    MYAPP.linkTest({data, parentElement : newParentElement});
  },

  linkTest ({data = "", parentElement = null} = {}) {
    //TODO improve linkRegex
    const lineStrings = data.split(/\s/), linkRegex = /^https?:\/\/[^\s]+/;
    lineStrings.map((lineString) => {
      if (linkRegex.test(lineString)) {
        let element = document.createElement("a");
        parentElement.appendChild(element);
        element.setAttribute("href", lineString);
        MYAPP.textOutput({data : lineString, element});
      } else {
        MYAPP.textOutput({data : lineString, element : parentElement});
      }
    });
  },

  textOutput ({data = "", element = null} = {}) {
    if (element) {
      if (element.hasChildNodes) {
        const textNode = document.createTextNode(` ${data}`);
        element.appendChild(textNode);
      } else {
        element.textContent = data;
      }
    } else {
      console.log('Error: missing parent element.');
    }
  }
}

window.addEventListener("load", MYAPP.fileReader, false);
