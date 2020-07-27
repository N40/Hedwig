// ---- GLOBAL VARIABLES ---- //
var PT_DATA_BIND = {
  "Mein_Programm": ()=>extract_data_by_level("Eigen"),
  "Wahlprogramm":  ()=>extract_data_by_type("WP"),
  "Ringezeit":     ()=>extract_data_by_type("RZ"),
  "Besuchertag":   ()=>extract_data_by_type("BT")
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

function extract_data_by_type(type, data_in=null){
  if (!list_contains_element(["WP", "BT", "RZ"], type)){
    return {};
  }

  if (!data_in){
    var data_in = local_data;
  }

  var ret_data = {};
  
  for (var p_id in data_in) {
    if (validate_Z_type(data_in[p_id], type)){
      ret_data[p_id] = data_in[p_id];
    }
  }

  return ret_data;
}

function extract_data_by_level(level = "Eigen", data_in=null){
  if (!data_in){
    var data_in = local_data;
  }

  if (level == "GL"){
    return data_in;
  }
  
  var ret_data = {};


  // user-dependent selection
  if (!u_info){return;}

  if (level == "Eigen"){
    for (p_id in data_in) {
      if (u_info.u_id == p_id.slice(0,4)){
        ret_data[p_id] = data_in[p_id];
      }
    }
  } else if (level == "UL"){
    for (p_id in data_in) {
      if (u_info.u_id[0] == p_id[0]){
        ret_data[p_id] = data_in[p_id];
      }
    }
  }
  return ret_data;

}

function extract_data_by_date(date, data_in=null){
  if (!data_in){
    var data_in = local_data
  }

  // date must be of form 03.08
  var _date = date.split(".").join("_")
  var ret_data = {};
  for (var date_key in static_definitions.ti_days) {
    if (!date_key.endsWith(_date)){
      continue;
    }

    for (var p_id in data_in){
      if (data_in[p_id][date_key]){
        ret_data[p_id] = data_in[p_id]
      }
    }

  }

  return ret_data  
}

function extract_data_by_ul(ul, data_in=null){
  if (!data_in){
    var data_in = local_data;
  }

  // ul must be character of form 0,1,2,...9,T,A
  var ret_data = {};


  for (var p_id in data_in){
    if (p_id[0] == ul){
      ret_data[p_id] = data_in[p_id];
    }

  }

  return ret_data  
}

function extract_data_by_type_date_ul(type, date, ul, data_in=null){
  if (!data_in){
    var data = local_data;
  } else {
    var data = data_in;
  }

  if (ul != "all"){
      data = extract_data_by_ul(ul, data);
  }   
  if (date != "all"){
      data = extract_data_by_date(date, data);
  }
  if (type != "all"){
      data = extract_data_by_type(type, data);
  }
  return data;
}

function extract_data_for_table(tablediv){
  var table_name = tablediv.id;
  var ret_data = PT_DATA_BIND[table_name]();

  var date_ul_select = tablediv.querySelector("#pt_date_ul_select");
  if (date_ul_select){
    var date = date_ul_select.querySelector("#date_select").value;
    var ul   = date_ul_select.querySelector("#ul_select").value;

    if (date != "all"){
      ret_data = extract_data_by_date(date, ret_data);
    }
    if (ul != "all"){
      ret_data = extract_data_by_ul(ul, ret_data);
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