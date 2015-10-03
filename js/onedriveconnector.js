var onedrive_token

Date.prototype.addHours= function(h){
  this.setHours(this.getHours()+h);
  return this;
}

function initializeOneDrive() {
  if(window.location.hash.substr(1).split('=')[1] && window.location.hash.substr(1).indexOf('dropboxLogin') == -1) {
    onedrive_token = decodeURIComponent(window.location.hash.substr(1).split('=')[1].split('&')[0])
    history.pushState("", document.title, window.location.pathname + window.location.search);
    cloudStorageConnected("onedrive")
  }

  if(onedrive_token) {
    window.localStorage.setItem("onedrive_token", onedrive_token);
    window.localStorage.setItem("expire", new Date().addHours(1));

    if(window.localStorage.getItem("location_restore")) {
      var l = window.localStorage.getItem("location_restore") + ''
      console.log(l)
      window.localStorage.setItem("location_restore", undefined)
      location = l
    }

  } else {
    if(window.localStorage.getItem("onedrive_token") &&  window.localStorage.getItem("expire") > new Date()) {
      onedrive_token = window.localStorage.getItem("onedrive_token");
    } else if(window.localStorage.getItem("onedrive_token")){
      window.localStorage.setItem("onedrive_token", undefined)
      window.localStorage.setItem("location_restore", location.href)
      console.log(location.href)
      location = "https://login.live.com/oauth20_authorize.srf?client_id=000000004816FB64&scope=onedrive.readwrite&response_type=token&redirect_uri=https://splitbox.me"
    }
  }
  console.log("[DEBUG] OneDrive Token: " + onedrive_token)
}

function uploadFileToOneDrive(name, file, callback) {

  $.ajax({
    type: "PUT",
    processData:false,
    data: file,
    beforeSend: function (xhr) {
      xhr.setRequestHeader ("Authorization", "bearer "+onedrive_token);
    },
    url:'https://api.onedrive.com/v1.0/drive/root:/Apps/SplitBox/'+name+':/content',
    contentType: 'multipart/form-data',
    success: function(result) {
      $.ajax({
        type: "GET",
        url:'http://proxysplitbox.cloudapp.net:8080/?auth=' + encodeURIComponent(onedrive_token) + '&url=' + encodeURIComponent('https://api.onedrive.com/v1.0/drive/root:/Apps/SplitBox/' + name + ':/content'),
        success: function(result) {
          callback(result)
        }
      });
    }
  });
}
