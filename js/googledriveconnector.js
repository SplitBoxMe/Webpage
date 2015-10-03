// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '51094403642-h70gvkengs2plg5tp5ah67jpn6ukhjq2.apps.googleusercontent.com';

var SCOPES = ['https://www.googleapis.com/auth/drive.appfolder'];

/**
 * Called when the client library is loaded.
 */

function initializeGoogleDrive() {
    checkAuth();
}

function authorizeWithGoogleDrive() {
    gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
        function(authResult){
            //On done with google Auth
            console.log(authResult)
        });
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
    if (authResult.error_subtype && authResult.error_subtype == "access_denied") {
        // No access token could be retrieved, force the authorization flow.
        gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
            handleAuthResult);
    } else {
        // Access token has been successfully retrieved, requests can be sent to the API
        cloudStorageConnected("googledrive")
    }
}