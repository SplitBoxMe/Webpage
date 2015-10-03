// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '51094403642-h70gvkengs2plg5tp5ah67jpn6ukhjq2.apps.googleusercontent.com';

var SCOPES = ['https://www.googleapis.com/auth/drive.appfolder'];

/**
 * Called when the client library is loaded.
 */
function handleClientLoad() {
    
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
        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
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
        console.log("has access")
    } else {
        // No access token could be retrieved, force the authorization flow.
        console.log("has no access")
        gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
            handleAuthResult);
    }
}

handleClientLoad()