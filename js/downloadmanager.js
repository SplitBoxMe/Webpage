function readFileParam() {
  var fileParam = getUrlParam("file");
  if (fileParam != null) {
    encodeUrlFromBase64(fileParam);
  }
}

function encodeUrlFromBase64(base64) {
  var urls;

  // base64 -> urls


  downloadFileParts(urls);
}

function downloadFileParts(urls) {
  downloadStarted("Downloading file parts");

  for (var i = 0; i < urls.length; i++) {
    var progress = Math.random() * 100;
    setDownloadStatus("Downloading part " + i, progress);

    // download
  }

  downloadFinished();
}