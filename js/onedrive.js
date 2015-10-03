var onedrive_token
if(window.location.hash.substr(1).split('=')[1]) {
  onedrive_token = window.location.hash.substr(1).split('=')[1].split('&')[0]\
  document.getElementById('oneDriveConnectButton').style.display = "none";
}