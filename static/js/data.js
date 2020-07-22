// ---- GLOBAL VARIABLES ---- //
var PT_DATA_BIND = {
  "Mein_Programm": ()=>extract_data("Eigen"),
  "Wahlprogramm":  ()=>extract_data("WP"),
  "Ringezeit":     ()=>extract_data("RZ"),
  "Besuchertag":   ()=>extract_data("BT")
}


var TI_DATES_FORM = {
  "Z_WP_03_08": "Wahlprogramm, 03.08",
  "Z_WP_04_08": "Wahlprogramm, 04.08",
  "Z_WP_05_08": "Wahlprogramm, 05.08",
  "Z_WP_09_08": "Wahlprogramm, 09.08",
  "Z_WP_10_08": "Wahlprogramm, 10.08",
  // 
  "Z_BT_08_08": "Besuchertag, 08.08",
  // 
  "Z_RZ_03_08": "Ringezeit, 03.08",
  "Z_RZ_04_08": "Ringezeit, 04.08",
  "Z_RZ_05_08": "Ringezeit, 05.08",
  "Z_RZ_09_08": "Ringezeit, 09.08",
  "Z_RZ_10_08": "Ringezeit, 10.08"
}

var DEFAULT_ROW_DATA = {
  "Titel": "",
  "Kurztext": "",
  "Langtext": "",
}


// ---- DATA MANIP ----- //
function validate_Z_type(p_data, type){
  if (!list_contains_element(["WP","BT","RZ"], type)){
    return;
  }

  for (var field in p_data){
    if (field.startsWith("Z_"+type)){
      if (p_data[field]) {
        // this should hold true for anything but ["",undefined,null]
        return true;
      }
    }
  }
  return false;

}

function extract_data(level = "Eigen"){
  if (level == "GL"){
    return local_data;
  }
  
  var ret_data = {};
  
  if (list_contains_element(["WP", "BT", "RZ"], level)){
    for (var p_id in local_data) {
      if (validate_Z_type(local_data[p_id], level)){
        ret_data[p_id] = local_data[p_id];
      }
    }
    return ret_data;
  }


  // user-dependent selection
  if (!u_info){return;}

  if (level == "Eigen"){
    for (p_id in local_data) {
      if (u_info.u_id == p_id.slice(0,4)){
        ret_data[p_id] = local_data[p_id];
      }
    }
  } else if (level == "UL"){
    for (p_id in local_data) {
      if (u_info.u_id[0] == p_id[0]){
        ret_data[p_id] = local_data[p_id];
      }
    }
  }
  return ret_data;


}


// ----- ACCESS RIGHTS HANDLING ------
function rights_get_rights(u_id){
  if (u_id[0]=="0"){
    return static_definitions.rights_dict["Admin"]
  } else if (u_id.split(".")[1] == "00"){
    return static_definitions.rights_dict["ULL"]
  } else {
    return static_definitions.rights_dict["Stamm"]
  }
}
function rights_get_subrights(u_id, p_id){
  var _rights = rights_get_rights(u_id);
  if (p_id.slice(0,4) == u_id){
    return _rights["Eigen"]
  } else if (p_id[0] == u_id[0]){
    return _rights["UL"]
  } else {
    return _rights["GL"]
  }
}

function rights_get_field_access(p_id, field){
  var u_id = u_info.u_id;
  var subrights = rights_get_subrights(u_id, p_id)

  if (field[0] == "Z"){
    return subrights["Zeiten"];
  }
  else if (field in subrights){
    return subrights[field];
  }

  return -1;
}