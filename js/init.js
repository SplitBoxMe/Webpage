initDropZone();

(function($){
  $(function(){

  	$('select').material_select();
  	$('.button-collapse').sideNav();
  	
	window.dispatchEvent(new Event('resize'));

  }); // end of document ready
})(jQuery); // end of jQuery name space

function processFile() {  
  $('#modalUpload').openModal();
  setUploadStatus("Preparing file", 0);
  //$('#modalUpload').closeModal();
}

function setUploadStatus(heading, percentage) {
  var uploadHeader = document.getElementById("uploadHeader");
  var uploadDescription = document.getElementById("uploadDescription");

  if (heading != null) {
    uploadHeader.innerHTML = heading;
  }
  uploadDescription.innerHTML = "SplitBox is processing your file, this may takes a few seconds. " + percentage + "% done."

  var container = document.getElementById("uploadAnimationContainer");
  var leftBox = document.getElementById("boxLeft");
  var rightBox = document.getElementById("boxRight");
  
  container.percentage = percentage;

  // resize box
  leftBox.style.height = container.offsetHeight + "px";
  leftBox.style.width = leftBox.style.height;

  rightBox.style.height = leftBox.style.height;
  rightBox.style.width = leftBox.style.width;

  // center box
  var maximumOffset = (leftBox.offsetWidth / 12);
  var centerOffset = ((container.offsetWidth / 2) - (leftBox.offsetWidth / 2));
  var percentageOffset = Math.round((percentage * maximumOffset) / 100);
  
  leftBox.style.left = (centerOffset - percentageOffset) + "px";
  rightBox.style.left = (centerOffset + percentageOffset) + "px";
  rightBox.style.top = (percentageOffset / 2) + "px"

  // rotate
  var maximumDeg = 20;
  var deg = Math.round((percentage * maximumDeg) / 100);
  rightBox.style.webkitTransform = 'rotate('+deg+'deg)'; 
  rightBox.style.mozTransform    = 'rotate('+deg+'deg)'; 
  rightBox.style.msTransform     = 'rotate('+deg+'deg)'; 
  rightBox.style.oTransform      = 'rotate('+deg+'deg)'; 
  rightBox.style.transform       = 'rotate('+deg+'deg)'; 
}

function initDropZone() {
  console.log("Initializing drop zone");

  Dropzone.options.imageDropzone = {
    paramName: "fileUpload", // The name that will be used to transfer the file
    maxFilesize: 500, // MB
    uploadMultiple: false,
    init: function() {
      this.on("addedfile", function(file) {
        handleFileSelect([file])
        checkCompatibility();
      });

      this.on("complete", function(file) {
        console.log("Dropzone complete");
        //console.log(document.getElementById("imageDropzone").files.getAcceptedFiles());
      });
      this.on("thumbnail", function(file, dataUrl) {
        console.log("Dropzone thumbnail");
        var targetThumbnailWidth = file.width;
        var targetThumbnailHeight = file.height;        
      });
      this.on("uploadprogress", function(file, progress, bytesSent) {
        console.log("Dropzone uploadprogress: " + progress);
      });
      this.on("success", function(file, response) {
        console.log("Dropzone success: " + response);
      });

      this.uploadFiles = function(files) {
        console.log("Simulating file upload");
        return this._finished(files, "success", null);
      }
    },
    accept: function(file, done) {
      done();
      //done("Upload blocked");
    }
  };  
}

function checkCompatibility() {
  var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
  var compatibilityWarning = document.getElementById("compatibilityWarning");
  if (!isChrome) {
    compatibilityWarning.classList.remove("hide");
  } else {
    compatibilityWarning.classList.add("hide");
  }
}

function getUrlParam(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}