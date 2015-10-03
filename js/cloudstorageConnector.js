function connectToDropbox(){
    console.log("Connect to dropbox")

    $.post( "https://api.dropboxapi.com/1/oauth/request_token", function( data ) {
        console.log(data)
    });

}