// global variables
var data_from_server = {};
var data_to_server = {};
var local_data;

// Server -> Client
function ajax_get(url, callback) {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // console.log(xhttp.responseText)
            callback(xhttp.responseText);
        };
    };
    xhttp.open("GET", url, true);
    xhttp.send();
};


function pull_data(callback = function(){return;}){
    if (!u_info){return};

    url = "data/pull_data?key=" + u_info.key;
    ajax_get(url, function(response){
        data_from_server = JSON.parse(response);
        local_data = data_from_server;
        update_debug_div();
        callback();
    })

}

function pull_user_dict(callback = function(response){return;}){
  if (!u_info){return;}

  url = "/user/pull_user_dict?key="+u_info.key
  ajax_get(url, function(response){
    local_user_dict = JSON.parse(response);

    for (u_id in local_user_dict) {
      local_user_dict[u_id].Keys = key_string_to_list(local_user_dict[u_id].Keys);
    }

    // console.log("fetched udict");
    init_ukc_table();
    init_ukc_form();
    callback();
  })
}

// Client -> Server
function ajax_send(url, content, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            callback(xhttp.responseText);
        };
    };
    xhttp.open('POST', url);
    xhttp.setRequestHeader('content-type', 'application/json');
    xhttp.send(content)
}

function push_data(callback = function(response){return;}){
    if (!u_info){return};
    if (Object.keys(data_to_server).length == 0){
        callback();
        return;
    };

    url = "data/push_data?key=" + u_info.key;
    ajax_send(url, JSON.stringify(data_to_server), function(response){
        data_to_server = {};
        callback();
    });
}

function push_user_dict(callback = function(response){return;}){
  if (!u_info){return;}
  if (Object.keys(user_dict_to_server).length == 0){
      callback();
      return;
  };

  var user_dict_to_server_temp = user_dict_to_server;

  for (u_id in user_dict_to_server) {
    user_dict_to_server_temp[u_id].Keys = key_list_to_string(user_dict_to_server_temp[u_id].Keys);
  }

  url = "/user/push_user_dict?key="+u_info.key
  ajax_send(url, JSON.stringify(user_dict_to_server_temp), function(response){
      user_dict_to_server = {};
      callback();
  });
}



// Syncing

function syncronize_full(){
  syncronize_data (function(){
  syncronize_user_dict ( function(){
  post_sync()
  });
  });
}

function syncronize_data(callback = function(){return}){
  // step 1
  document.querySelector("#sync_btn").querySelector("i").classList.add("w3-spin_bw");

  document.getElementById("server_info_div").querySelector("#status").innerHTML = "Sende Daten...";
  push_data(function(){
  // step 2
    document.getElementById("server_info_div").querySelector("#status").innerHTML = "Lade Daten...";
    pull_data(function(){
  // step 3
      callback()
    });
  });
}

function syncronize_user_dict(callback = function(){return}){
  // step 1
  document.querySelector("#sync_btn").querySelector("i").classList.add("w3-spin_bw");

  document.getElementById("server_info_div").querySelector("#status").innerHTML = "Sende Benutzerdaten...";
  push_user_dict(function(){
  // step 2
    document.getElementById("server_info_div").querySelector("#status").innerHTML = "Lade Benutzerdaten...";
    pull_user_dict(function(){
  // step 3
      callback()
    });
  });
}