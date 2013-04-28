function saveAccessTokenInLocalStorage () {
   
   var url_params = [];
   var params = window.top.location.href.slice(window.top.location.href.indexOf('#')+1);
   params = params.split('&');   
   
   for (var i in params) {
   
      var item = params[i].split('=');
      url_params[item[0]] = item[1];
   }
   
   // save token
   localStorage.setItem('access_token', decodeURI(url_params.access_token));
  
}