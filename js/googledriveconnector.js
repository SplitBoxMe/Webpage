// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '51094403642-h70gvkengs2plg5tp5ah67jpn6ukhjq2.apps.googleusercontent.com';

var SCOPES = ['https://www.googleapis.com/auth/drive.appfolder'];

function initializeGoogleDrive() {
    checkAuth();
}

function authorizeWithGoogleDrive() {
    gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
        function(authResult){
            //On done with google Auth
            window.localStorage.setItem("googledriveToken", authResult.access_token)
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
    console.log("Google Result", authResult)
    if (authResult.error_subtype && authResult.error_subtype == "access_denied") {
        // No access token could be retrieved, force the authorization flow.
        gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
            handleAuthResult);
    } else {
        // Access token has been successfully retrieved, requests can be sent to the API
        cloudStorageConnected("googledrive")

        uploadFile()
    }
}

function uploadFile(){
    $.ajax({
        url: 'https://www.googleapis.com//upload/drive/v2/files?uploadType=media',
        type: 'post',
        data: "data123456sdlöfhjvnkalösdfgkjdlöadf",
        headers: {
            Authorization: 'Bearer ' + window.localStorage.getItem("googledriveToken")
        },
        //dataType: 'json',
        success: function (data) {
            console.log(data);
        }
    });
}
