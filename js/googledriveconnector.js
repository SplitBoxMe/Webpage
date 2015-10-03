// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '554698242471-3th8kuior2siu7sdli3uii57oop42sd3.apps.googleusercontent.com';

var SCOPES = ['https://www.googleapis.com/auth/drive.appfolder'];

/**
 * Called when the client library is loaded.
 */
function handleClientLoad() {
    //checkAuth();
}

function authorizeWithGoogleDrive() {
    checkAuth();
}

/**
 * Check if the current user has authorized the application.
 */
function checkAuth() {
    if (gapi.auth != null) {
        gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
        handleAuthResult);
    }
}

/**
 * Called when authorization server replies.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
    console.log("Google Result", authResult)
    if (authResult) {
        // Access token has been successfully retrieved, requests can be sent to the API
    } else {
        // No access token could be retrieved, force the authorization flow.
        gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
            handleAuthResult);
    }
}

handleClientLoad()