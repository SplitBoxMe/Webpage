initDropZone();

(function($){
  $(function(){

  	$('select').material_select();
  	$('.button-collapse').sideNav();
  	
	window.dispatchEvent(new Event('resize'));

  }); // end of document ready
})(jQuery); // end of jQuery name space

function initDropZone() {
  console.log("Initializing drop zone");

  Dropzone.options.imageDropzone = {
    paramName: "fileUpload", // The name that will be used to transfer the file
    maxFilesize: 500, // MB
    uploadMultiple: false,
    init: function() {
      this.on("addedfile", function(file) {
        console.log("Dropzone added file");
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