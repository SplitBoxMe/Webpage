var animationInterval = 30;
var animationStep = 0;
var animationHandle;

initDropZone();

(function($){
	$(function(){

	$('.button-collapse').sideNav();
	$('.tooltipped').tooltip({delay: 50});
	window.dispatchEvent(new Event('resize'));

	initializeOneDrive();
	initializeDropbox();
	initializeGoogleDrive()
	readFileParam();

	}); // end of document ready
})(jQuery); // end of jQuery name space

function cloudStorageConnected(name) {
	var button = document.getElementById("cloud_" + name);
	if (button != null) {
		var icon = button.getElementsByTagName("i")[0];
		icon.innerHTML = "cloud_done";
		addClassName(button, "disabled");
	}
}

function cloudStorageDisconnected(name) {
	var button = document.getElementById("cloud_" + name);
	if (button != null) {
		var icon = button.getElementsByTagName("i")[0];
		icon.innerHTML = "cloud_queue";
		removeClassName(button, "disabled");
	}
}

function encryptLink() {
	var link = document.getElementById("downloadLink").value.replace("https://splitbox.me/?", ""),
		passphrase = generatePassphrase()

	var encrypted = CryptoJS.AES.encrypt(link, passphrase);

	document.getElementById("downloadLink").value = "https://splitbox.me?encrypt=" + encrypted
	document.getElementById("decryptPass").value = passphrase

	var smsForm = document.getElementById("sendSMSForm");
	removeClassName(smsForm, "hide");
}

function decryptLink(linkEncrypted, passphrase){
	return CryptoJS.AES.decrypt(linkEncrypted, passphrase)
}

function generatePassphrase(){
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

	for( var i=0; i < 8; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function shareFile() {
	$('#modalShare').openModal();
}

function shareLinkViaMail() {
	var mail = document.getElementById("mailAddress").value;
	var link = document.getElementById("downloadLink").value;
	var subject = "File shared via SplitBox";
	var message = "Hey,<br/>someone wants to share a file with you:<br/><br/>" + document.getElementById("mailMessage").innerHTML;
	message += "<br/><br/>Download: " + link;

	sendMail(mail, subject, message);
}

function sharePassViaSMS() {
	var number = document.getElementById("phoneNumber").value;
	var decryptPass = document.getElementById("decryptPass").value;
	var message = "SplitBox key: " + decryptPass;
	
	sendSMS(number, message)
}

function processFile() {
	$('#modalUpload').openModal();
	setUploadStatus("Preparing file", 0);
}

function uploadStarted(heading, indeterminate) {
	if (indeterminate) {
		// use indeterminate progress
		setUploadStatus(heading);
		animationHandle = setInterval(indeterminateUploadUpdate, animationInterval);
	} else {
		// progress reporting available
		setUploadStatus(heading, 0);
	}
}

function uploadFinished() {
	$('#modalUpload').closeModal();
	clearInterval(animationHandle);

	var shareButton = document.getElementById("shareButton");
	removeClassName(shareButton, "disabled");
}

function indeterminateUploadUpdate() {
	animationStep += 1;
	if (animationStep > 200) {
		animationStep = 0;
	}
	if (animationStep > 100) {
		animateUploadStatus(200 - animationStep);
	} else {
		animateUploadStatus(animationStep);  
	}
}

function setUploadStatus(heading, percentage) {
	var uploadHeader = document.getElementById("uploadHeader");
	var uploadDescription = document.getElementById("uploadDescription");

	if (heading != null) {
		uploadHeader.innerHTML = heading;
	}

	uploadDescription.innerHTML = "SplitBox is processing your file, this may takes a few seconds. ";
	if (percentage != null) {
		uploadDescription.innerHTML += percentage + "% done.";
		animateUploadStatus(percentage);
	}
}

function animateUploadStatus(percentage) {
	var container = document.getElementById("uploadAnimationContainer");
	var leftBox = document.getElementById("boxLeft");
	var rightBox = document.getElementById("boxRight");

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

function downloadStarted(heading, indeterminate) {
	$('#modalDownload').openModal();
	if (indeterminate) {
		// use indeterminate progress
		animationStep = 100;
		setDownloadStatus(heading);
		animationHandle = setInterval(indeterminateDownloadUpdate, animationInterval);
	} else {
		// progress reporting available
		setDownloadStatus(heading, 0);
	}
}

function downloadFinished() {
	$('#modalDownload').closeModal();
	clearInterval(animationHandle);
}

function indeterminateDownloadUpdate() {
	animationStep += 1;
	if (animationStep > 200) {
		animationStep = 0;
	}
	if (animationStep > 100) {
		animateDownloadStatus(200 - animationStep);
	} else {
		animateDownloadStatus(animationStep);  
	}
}

function setDownloadStatus(heading, percentage) {
	var uploadHeader = document.getElementById("downloadHeader");
	var uploadDescription = document.getElementById("downloadDescription");

	if (heading != null) {
		uploadHeader.innerHTML = heading;
	}

	uploadDescription.innerHTML = "We'll download, merge and decrypt your file now. ";
	if (percentage != null) {
		uploadDescription.innerHTML += percentage + "% done.";
		animateDownloadStatus(percentage);
	}
}

function animateDownloadStatus(percentage) {
	var container = document.getElementById("downloadAnimationContainer");
	var leftBox = document.getElementById("boxDownloadLeft");
	var rightBox = document.getElementById("boxDownloadRight");
	
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
	//console.log("Initializing drop zone");

	Dropzone.options.imageDropzone = {
		paramName: "fileUpload", // The name that will be used to transfer the file
		maxFilesize: 500, // MB
		uploadMultiple: false,
		init: function() {
			this.on("addedfile", function(file) {
				if (dropboxIsAuthenticated && googledriveIsAuthenticated || dropboxIsAuthenticated && onedriveIsAuthenticated || googledriveIsAuthenticated && onedriveIsAuthenticated) {
					handleFileSelect([file]);  
				}
				checkCompatibility();
			});

			this.on("complete", function(file) {
				console.log("Dropzone complete");

				var processButton = document.getElementById("processButton");
				removeClassName(processButton, "disabled");
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
			if (dropboxIsAuthenticated && googledriveIsAuthenticated || dropboxIsAuthenticated && onedriveIsAuthenticated || googledriveIsAuthenticated && onedriveIsAuthenticated) {
				done();
			} else {
				Materialize.toast("Connect at least two cloud services", 4000);
				done("Connect at least two cloud services");
			}
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

function addClassName(element, className) {
	if (element.className.indexOf(className) < 0) {
		element.className += " " + className;
	}
}

function removeClassName(element, className) {
	if (element.className.indexOf(className) > -1) {
		element.className = element.className.replace(className, "");
	}
}