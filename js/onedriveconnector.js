var onedrive_token

function initializeOneDrive() {
  if(window.location.hash.substr(1).split('=')[1] && window.location.hash.substr(1).indexOf('dropboxLogin') == -1) {
    onedrive_token = decodeURIComponent(window.location.hash.substr(1).split('=')[1].split('&')[0])
    history.pushState("", document.title, window.location.pathname + window.location.search);
    cloudStorageConnected("onedrive")
  }

  if(onedrive_token) {
    window.localStorage.setItem("onedrive_token", onedrive_token);
  } else {
    onedrive_token = window.localStorage.getItem("onedrive_token");
  }
  console.log("[DEBUG] OneDrive Token: " + onedrive_token)
}

function uploadFileToOneDrive(name, file, callback) {
  data = new FormData();
  data.append( file )

  $.ajax({
    type: "PUT",
    processData:false,
    data: data,
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
