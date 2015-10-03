function handleFileSelect(files) {
  var name = files[0].name
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

        var uploads = 0
        var links = {
          key: '',
          cipher: ''
        }
        writeFileToDropbox(name, splitfile.key).then(function(result) {
          uploads++
          links.key = result
          showLink()
        })

        uploadFileToOneDrive(name, splitfile.cipher, function(cipherResult) {
          uploads++
          links.cipher = cipherResult
          showLink()
        })

        function showLink() {
          console.log('called')
          if(uploads < 2) {
            return
          }
          console.log('https://splitbox.me/?file=' + btoa(links.key)+'|'+btoa(links.cipher))
          console.log(atob(btoa(links.key)+'|'+btoa(links.cipher)).split['|'][0])

        }
        //saveByteArray([splitfile.cipher], name);
        //decrypt(splitfile)
        //saveByteArray([splitfile.plain], name);
      };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsArrayBuffer(f);
  }
}

function encrypt(splitfile){
  splitfile.cipher =  new Uint8Array(splitfile.plain.length)
  for (var cycle = 0 ; cycle < splitfile.plain.length ; cycle++) {
    var current_key = new Uint8Array(1)
    window.crypto.getRandomValues(current_key);
    splitfile.key[cycle] = current_key[0]
    splitfile.cipher[cycle] = (splitfile.key[cycle] + splitfile.plain[cycle]) % 255
  }
}