// ---- GLOBAL VARIABLES ---- //
var new_user_id_temp = null;


// UKC - User Key Controll
function init_ukc_table(){
  u_table_templates = document.getElementsByTagName("template").u_table_templates;
  u_table = document.importNode(u_table_templates.content.querySelector(".c-utable"), true);
  document.getElementById('ukc_table_container').innerHTML = "";
  document.getElementById('ukc_table_container').appendChild(u_table);

  urow_tmp = u_table_templates.content.querySelector(".c-urow");
  klitem_tmp = u_table_templates.content.querySelector(".c-klitem");

  for (u_id in local_user_dict){
    new_urow = document.importNode(urow_tmp, true);
    new_urow.id = u_id;
    new_urow.querySelector("#u_id").innerHTML = u_id;


    new_urow.querySelector("#Name").innerHTML = local_user_dict[u_id].Name;
    new_urow.querySelector("#Verband").innerHTML =
      local_user_dict[u_id].Verband||"<i class=\'w3-small w3-text-grey\'>?Verband?</i>";

    if (!local_user_dict[u_id].Keys) {
      continue;
    }

    for (var i = local_user_dict[u_id].Keys.length - 1; i >= 0; i--) {
      key = local_user_dict[u_id].Keys[i]
      new_klitem = document.importNode(klitem_tmp, true);
      new_klitem.id = key
      new_klitem.querySelector(".c-keyfield").innerHTML = key;
      new_urow.querySelector("#Key-List").appendChild(new_klitem);
      new_klitem.querySelector(".c-key_delete_btn").addEventListener(
        "click", remove_this_key)
    }


    u_table.appendChild(new_urow);
  }
}

function remove_this_key(){
  key = this.closest(".c-klitem").id;
  u_id = this.closest(".c-urow").id;
  local_user_dict[u_id].Keys.splice(local_user_dict[u_id].Keys.indexOf(key),1);
  
  user_dict_to_server[u_id] = local_user_dict[u_id];
  update_changes_to_server();
  init_ukc_table();
}



function init_ukc_form(){

  ukc_creation_form = document.querySelector("#ukc_creation_form");

  ul_selector = ukc_creation_form.querySelector('#Unterlager');
  ul_selector.innerHTML = '';

  if (u_info.u_id[0]==0){
    for (ul_key in static_definitions.unterlager_dict){
      new_html = key_manip_ul_options_html(ul_key);
      ul_selector.innerHTML += new_html;
    }
  } else{
    new_html = key_manip_ul_options_html(u_info.u_id[0]);
    ul_selector.innerHTML += new_html;
  }

  ul_selector.addEventListener("input", ukc_form_update_Name)


  name_selector = ukc_creation_form.querySelector('#Name_select');
  name_selector.addEventListener("input", ukc_form_react_Name)
  ukc_creation_form.querySelector("#Name_manual").classList.add("w3-hide")
  ukc_creation_form.querySelector("#Verband").value = "";

  ukc_creation_form.querySelector("#add_key_btn").addEventListener("click", ukc_form_submit_new_key_gen)


  ukc_form_update_Name();
}


function ukc_form_react_Name(){
  ukc_creation_form = document.querySelector("#ukc_creation_form");

  Name = ukc_creation_form.querySelector("#Name_select").value;
  if (Name=="new_user"){
    ukc_creation_form.querySelector("#Name_manual").classList.remove("w3-hide");
  } else {
    ukc_creation_form.querySelector("#Name_manual").classList.add("w3-hide")
    ukc_creation_form.querySelector("#Name_manual").value = "";

    if (Name != "create_ULL") {
      u_id_sel = Name;
      ukc_creation_form.querySelector("#Verband").value =
        (local_user_dict[u_id_sel].Verband || "");
    };
  }
}

function ukc_form_update_Name(){
  ukc_creation_form = document.querySelector("#ukc_creation_form");
  name_selector = ukc_creation_form.querySelector('#Name_select');
  name_selector.innerHTML = 
    "<option value=\"\" disabled selected></option>\n"+
    "<option value=\"new_user\">+ neuen Benutzer anlegen</option>";

  sel_ul_id = ukc_creation_form.querySelector('#Unterlager').value
  for (x_u_id in local_user_dict){
    if (!local_user_dict[x_u_id].Name){
      continue;
    }

    if (x_u_id[0] == sel_ul_id){
      name_selector.innerHTML +=
        "<option value=\""+x_u_id+"\">"+local_user_dict[x_u_id].Name+"</option";
    }
  }

  if (!(sel_ul_id+".00" in local_user_dict)){
    name_selector.innerHTML +=
      "<option value=\"create_ULL\">! Unterlager-Leitung anlegen</option>";
  }

}

function ukc_form_submit_new_key_gen(){
  ukc_creation_form = document.querySelector("#ukc_creation_form");
  Verband = ukc_creation_form.querySelector('#Verband').value
  ul_id = ukc_creation_form.querySelector('#Unterlager').value
  u_id = ukc_creation_form.querySelector('#Name_select').value;


  if(u_id=="new_user"){

    url = "/user/get_new_user_id?key="+u_info.key+"&tulid="+ul_id[0];
    ajax_get(url, function(new_u_id){
      local_user_dict[new_u_id] = {
        "Name"    : document.querySelector("#ukc_creation_form").querySelector('#Name_manual').value,
        "Verband" : document.querySelector("#ukc_creation_form").querySelector('#Verband').value,
        "Keys"    : [],
        "meta"    : 'Created at ['+get_date_formated()+'] by user-id ['+u_info.u_id+']',
      }
      ukc_add_new_key(new_u_id);

    })
  }
  else if (u_id=="create_ULL") {
    var ul_u_id = ul_id[0]+".00";
    if (ul_u_id in local_user_dict){
      return;
    }

    local_user_dict[ul_u_id] = {
      "Name"    : "ULL "+static_definitions.unterlager_dict[ul_u_id[0]],
      "Verband" : document.querySelector("#ukc_creation_form").querySelector('#Verband').value,
      "Keys"    : []
    }
    ukc_add_new_key(ul_u_id)
  }
  else {
    ukc_add_new_key(u_id)
  }

}


function ukc_add_new_key(u_id, Name=""){
  if (new_user_id_temp){
    console.log("!! other process running, return");
    return;
  }

  new_user_id_temp = u_id;
  url = "user/get_new_user_key?key="+u_info.key // +"&tulid="+ul_id[0]; deprecated
  ajax_get(url, function(key){
    local_user_dict[new_user_id_temp].Keys.push(key);
    local_user_dict[new_user_id_temp].meta =
      'Modified at ['+get_date_formated()+'] by user-id ['+u_info.u_id+']'

    user_dict_to_server[new_user_id_temp] = local_user_dict[new_user_id_temp];
    new_user_id_temp = null;

    update_changes_to_server();
    init_ukc_table();
    init_ukc_form();
  })
}


// ---- MISC ---- //
function key_string_to_list(key_string){
  if (!key_string){ return null};

  var sub_parts = key_string.split(":");
  var key_list = [];
  for (var i = 0; i < sub_parts.length; i++) {
    if(sub_parts[i].length>0){
      key_list.push(sub_parts[i]);
    }
  }
  return key_list;
}

function key_list_to_string(key_list){
  if (key_list.length==0){
    return null;
  }
  return ":"+key_list.join(":")+":";

}