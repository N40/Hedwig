// global variables
var u_info = null;  

var key_manip_ul_options = {
  "1": "<option value=\"1\">[1] Espuertes</option>",
  "2": "<option value=\"2\">[2] Wasteland</option>",
  "3": "<option value=\"3\">[3] Brownsea Island</option>",
  "T": "<option value=\"T\">[T] Tortuga</option>",
  "0": "<option value=\"0\">[0] Admins</option>"
}

const key_manip_ul_options_html = (ul_key) => {
  var name = static_definitions.unterlager_dict[ul_key] || "unkown UL-Key";
  return "<option value=\""+ul_key+"\">["+ul_key+"] "+name+"</option>";
};

// Login / logout
function logout(){
  if (!u_info){return};

  url = "logout?key="+u_info.key;
  ajax_get(url, function(){
    
    window.location.reload(false); 
    return;
  });
}


function post_login(){
  pull_data(function(){

    update_page_visibilities()
    init_tables();
    update_user_info();
    update_server_status();
  })
}


function login(key){
  console.log(key);

  url = "login?key="+key;
  ajax_get(url,
    function(response){
      u_info = JSON.parse(response).u_info
      if (u_info == null) {
        document.getElementById("keyinputfield").classList.add("w3-text-red");
        return
      }

      document.getElementById("login_div").outerHTML = "";
      // document.getElementById("u_info_div").innerHTML = JSON.stringify(u_info, undefined, 2);
      u_info["key"] = key
      post_login();
      return;

    })
};



