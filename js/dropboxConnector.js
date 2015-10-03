var dropboxAppKey = "5tj76xeexmiy76h",
    client = null

function initDropboxClient(){
    client = new Dropbox.Client({ key: dropboxAppKey , token: "oxfXOJCMc9cAAAAAAAAYsqNYLaHpUE5ogP0Nw1-YbnPFsoaGgMwUOcbMGtxoJen0"});
    client.authenticate(function (err, client) {
        if(err){
            console.log(err)
            return false
        }else{
            console.log("Successfully authenticated")
            return true
        }
    });
}
initDropboxClient()

function getCurrentToken(){
    //Get token from cookie if it exists
}

function authorize(){
    window.location.replace( "https://www.dropbox.com/1/oauth2/authorize?client_id=" + dropboxAppKey + "&response_type=code")
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

function writeFile(filename, data){
    client.readFile("/"+filename, data, function(err, content){
    })
}