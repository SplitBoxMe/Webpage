function handleFileSelect(files) {

	$('#modalUpload').openModal();
	uploadStarted("Encrypting file", true);

	window.setTimeout(function() {
		var name = files[0].name
		var tmpName = Math.random().toString(36).substring(7);
		for (var i = 0, f; f = files[i]; i++) {
			var reader = new FileReader();
		  // Closure to capture the file information.
		  reader.onload = (function(theFile) {
			return function(e) {
				var plain = new Uint8Array(e.target.result);
				var key = new Uint8Array(plain.length)

				var splitfile = {
					plain: plain,
					key: key
				}

				var saveByteArray = (function () {
					var a = document.createElement("a");
					document.body.appendChild(a);
					a.style = "display: none";
					return function (data, name) {
						var blob = new Blob(data, {type: "octet/stream"}),
						url = window.URL.createObjectURL(blob);
						a.href = url;
						a.download = name;
						a.click();
						window.URL.revokeObjectURL(url);
					};
				}());

				encrypt(splitfile)

				setUploadStatus("Uploading file");

				var links = {
					key: '',
					cipher: ''
				}

				if(googledriveIsAuthenticated && dropboxIsAuthenticated) {
					uploadFileToGoogleDrive(tmpName, splitfile.key).then(function (result) {
						links.key = result
						showLink()
					})

					writeFileToDropbox(tmpName, splitfile.cipher, function(cipherResult) {
						links.cipher = cipherResult
						showLink()
					})
				} else if(googledriveIsAuthenticated && onedriveIsAuthenticated) {
					uploadFileToGoogleDrive(tmpName, splitfile.key).then(function (result) {
						links.key = result
						showLink()
					})

					uploadFileToOneDrive(tmpName, splitfile.cipher, function(cipherResult) {
						links.cipher = cipherResult
						showLink()
					})
				} else {
					writeFileToDropbox(tmpName, splitfile.key).then(function (result) {
						links.key = result
						showLink()
					})

					uploadFileToOneDrive(tmpName, splitfile.cipher, function(cipherResult) {
						links.cipher = cipherResult
						showLink()
					})
				}


				function showLink() {
					if (links.key.length > 0 && links.cipher.length > 0) {
						uploadFinished();
						shareFile();

						var downloadUrl = 'https://splitbox.me/?file=' + encodeURIComponent(btoa(links.key))+'|'+encodeURIComponent(btoa(links.cipher))+'|'+encodeURIComponent(btoa(name))
						$('#downloadLink')[0].value = downloadUrl;
						$('#downloadLink').siblings('label, i').addClass('active');
				  		//console.log(atob(btoa(links.key)+'|'+btoa(links.cipher)).split['|'][0])
					}
				}
				//saveByteArray([splitfile.cipher], name);
				//decrypt(splitfile)
				//saveByteArray([splitfile.plain], name);
			};
		})(f);

		  // Read in the image file as a data URL.
		  reader.readAsArrayBuffer(f);
		}
	}, 1000)
}

function encrypt(splitfile){
	splitfile.cipher =  new Uint8Array(splitfile.plain.length)
	for (var cycle = 0 ; cycle < splitfile.plain.length ; cycle++) {
		var current_key = new Uint8Array(1)
		window.crypto.getRandomValues(current_key);
		splitfile.key[cycle] = current_key[0]
		if(splitfile.plain[cycle] == 255) {
			splitfile.cipher[cycle] = 255
		} else {
			splitfile.cipher[cycle] = (splitfile.key[cycle] + splitfile.plain[cycle]) % 255
		}
	}
}

function sendSMS(number, message) {
	try {
		var requestUrl = "https://steppschuh.net/php/sms.php?message=" + encodeURIComponent(message) + "&number=" + encodeURIComponent(number);
		$.get(requestUrl, function(data){
			console.log(data);
			Materialize.toast("SMS sent", 4000);
		});
	} catch(ex) {
		Materialize.toast("Something went wrong", 4000)
	}
}

function sendMail(mail, subject, message) {
	try {
		if (mail.length < 4) {
			throw "Invalid fields";
		}

		var url = "http://steppschuh.net/php/mail.php";
		var params = "?to=" + mail;
		params = params + "&from_mail=" + "noreply@splitbox.me";
		params = params + "&from_name=" + encodeURIComponent("SplitBox.me");
		params = params + "&reply_to=" + "noreply@splitbox.me";
		params = params + "&subject=" + encodeURIComponent(subject);
		params = params + "&message=" + encodeURIComponent(message);
		
		var http = new XMLHttpRequest();
		http.open("GET", url+params, true);

		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		http.onreadystatechange = function() {
			if (http.readyState == 4 && http.status == 200) {
				Materialize.toast("Mail sent", 4000);
				console.log(http.responseText);				
			}
		}
		http.send(null);
	} catch(ex) {
		Materialize.toast("Something went wrong", 4000);
	}
}