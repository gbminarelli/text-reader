MYAPP = {
  fileReader () {
    const fileList = document.getElementById("fileList");
    // check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // all the File APIs are supported.
      fileList.addEventListener("change", () => {MYAPP.handleFiles(fileList);}, false);
    } else {
      alert('The File APIs are not fully supported in this browser.');
    }
  },

  handleFiles(fileList) {
    // get the elements inside of which we will output some kind of data.
    const parentElements = {
      numFiles : document.getElementById("numFiles"),
      fileData : document.getElementById("fileData")
    }
    // clear the parents of any previous data.
    MYAPP.clearOutputs(parentElements);
    // output the number of input files.
    MYAPP.textOutput({data : fileList.files.length, element : parentElements.numFiles});
    // output the files data.
    for (const file of fileList.files) {
      MYAPP.fileDataOutput({data : file, parentElement : parentElements.fileData});
    }
  },

  clearOutputs({fileData, numFiles} = {}) {
    // TODO write error handling code.
    numFiles.textContent = "";
    while (fileData.firstChild) {
      fileData.removeChild(fileData.firstChild);
    }
  },

  textOutput ({data = "", element = null} = {}) {
    // TODO write better error handling code.
    if (element) {
      if (element.hasChildNodes) {
        const textNode = document.createTextNode(`${data}`);
        element.appendChild(textNode);
      } else {
        element.textContent = data;
      }
    } else {
      console.log('Error: missing parent element.');
    }
  },

  fileDataOutput ({data = "", parentElement = null} = {}) {
    // TODO write error handling code.
    // extract metadata from the file (name, size and type) and define the new parent, that is,
    // the element inside of which the data (metadata and body content) of each file will be
    // displayed.
    const {name, size, type} = data, newParentElement = document.createElement("article");
    parentElement.appendChild(newParentElement);
    // output the files metadata.
    MYAPP.fileMetadataOutput({data : {name, size, type}, parentElement : newParentElement});
    MYAPP.getFileContent({data, parentElement : newParentElement});
  },

  fileMetadataOutput ({data = "", parentElement = null} = {}) {
    // TODO write error handling code.
    // TODO update the way metadata (name, size and type) is being displayed.
    const metadataString = JSON.stringify(data);
    MYAPP.fileOutput({data : metadataString, parentElement});
  },

  getFileContent ({data = "", parentElement = null} = {}) {
    // TODO write better error handling code.
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawText = event.target.result;
      MYAPP.fileOutput({data: rawText, parentElement});
      // const textLines = rawText.split(/\r\n|\n/); //CRLF or LF
      // textLines.map((line) => {
      //   MYAPP.fileOutput({data : line, parentElement});
      // });
    };
    reader.onerror = (event) => {
      alert(event.target.error.name);
    };
    reader.readAsText(data);
  },

  fileOutput ({data = "", parentElement = null} = {}) {
    // TODO write error handling code.
    const newParentElement = document.createElement("pre");
    parentElement.appendChild(newParentElement);
    // check for links in the text before the output.
    MYAPP.linkTest({data, parentElement : newParentElement});
  },

  linkTest ({data = "", parentElement = null} = {}) {
    // TODO write better error handling code.
    // TODO improve linkRegex.
    // TODO update the test. Not functional atm.
    const linkRegex = /https?:\/\/[^\s]+/g, newData = data.replace(linkRegex, (match) => {
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", match);
      linkElement.innerHTML = match;
      return linkElement.outerHTML;
    });
    MYAPP.textOutput({data : newData, element : parentElement});
  }
}

window.addEventListener("load", MYAPP.fileReader, false);
