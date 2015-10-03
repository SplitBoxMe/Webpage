var dropboxAppKey = "5tj76xeexmiy76h",
    client = null,
    dropboxIsAuthenticated = false

function initDropboxClient(token){
    client = new Dropbox.Client({ key: dropboxAppKey , token: token});
    client.authenticate(function (err, client) {
        if(err){
            console.log(err)
            return false
        }else{
            dropboxIsAuthenticated = true
            return true
        }
    });
}

function authorizeWithDropbox(){
    var redirect = "https://splitbox.me"
    window.location.replace( "https://www.dropbox.com/1/oauth2/authorize?client_id=" + dropboxAppKey + "&response_type=token&redirect_uri=" + redirect + "&state=dropboxLogin" )
}

function getFiles(){
    client.readdir("/", function(err, files){
        console.log(files)
    })
}

function getFile(filename){
    client.readFile("/"+filename, function(err, content){
        console.log(content)
    })
}

function writeFileToDropbox(filename, data){
    client.readFile("/"+filename, data, function(err, content){
    })
}

function onDropboxRedirect(token){
    window.localStorage.setItem("dropboxToken", token)
    initDropboxClient(token)
    window.location.hash = ""
}

function hashToDict(hash){
    var dict = {}
    hash = hash.replace("#", "")
    if(hash.length > 0){
        hash = hash.split("&")
        for(var i=0; i<hash.length; i++){
            var pair = hash[i].split("=")
            dict[pair[0]] = pair[1]
        }
    }
    return dict
}

var hashDict = hashToDict(window.location.hash)
if( Object.keys(hashDict).length > 0 ){
    if("state" in hashDict && hashDict["state"] == "dropboxLogin"){
        onDropboxRedirect(hashDict["access_token"])
    }
}else if( window.localStorage.getItem("dropboxToken") != null ){
    initDropboxClient(window.localStorage.getItem("dropboxToken"))
}