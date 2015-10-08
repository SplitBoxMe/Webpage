// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '51094403642-h70gvkengs2plg5tp5ah67jpn6ukhjq2.apps.googleusercontent.com',
    googledriveIsAuthenticated = false

var SCOPES = [ 'https://www.googleapis.com/auth/drive.file' , 'https://www.googleapis.com/auth/drive'];

function initializeGoogleDrive() {
    checkAuth();
}

function authorizeWithGoogleDrive() {
    gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
        function(authResult){
            //On done with google Auth
            window.localStorage.setItem("googledriveToken", authResult.access_token)
            cloudStorageConnected("googledrive");
            googledriveIsAuthenticated = true
        });
}

function checkAuth() {
    if (gapi.auth != null) {
        gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
        handleAuthResult);
    }
}


function handleAuthResult(authResult) {
    console.log(authResult)
    if (authResult.error_subtype && authResult.error_subtype == "access_denied") {
        // No access token could be retrieved, force the authorization flow.
        gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
            handleAuthResult);
    } else if(authResult.access_token && authResult.access_token != ""){
        // Access token has been successfully retrieved, requests can be sent to the API
        cloudStorageConnected("googledrive")
        googledriveIsAuthenticated = true
    }
}

//data has to be of type UInt8Array
function uploadFileToGoogleDrive(filename, data){
    var deferred = Q.defer()

    addFile(filename, data)
        .then(function(file){
            var fileId = file.id

            $.ajax({
                url: "https://www.googleapis.com/drive/v2/files/" + fileId + "/permissions",
                type: 'post',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    role: "reader",
                    type: "anyone",
                    withLink: "true"
                }),
                headers: {
                    Authorization: 'Bearer ' + window.localStorage.getItem("googledriveToken")
                },
                success: function () {
                    deferred.resolve('https://splitbox.me/googledriveproxy/' + file.webContentLink)
                }
            });
        })

    return deferred.promise
}

function addFile(filename, byteArray){
    var deferred = Q.defer()

    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    //Convert byteArray to blob
    var fileData = new Blob([byteArray], {type: 'application/octet-stream'});

    var reader = new FileReader();
    reader.readAsBinaryString(fileData);
    reader.onload = function(e) {
        var contentType = fileData.type || 'application/octet-stream';
        var metadata = {
            'title': filename,
            'mimeType': contentType
        };

        var base64Data = btoa(reader.result);
        var multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            base64Data +
            close_delim;

        var request = gapi.client.request({
            'path': '/upload/drive/v2/files',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody});

        request.execute(function(file){
            deferred.resolve(file)
        });
    }

    return deferred.promise
}
