// ---- EXISTENS STUFF ---- //
function pt_row_create_new(){
  row_tmp = document.getElementsByTagName("template")[0].content.querySelector("#tmp_p_tablerow");
  var new_row = document.importNode(row_tmp, true);

  new_row.expanded = false;
  new_row.writable = false;

  new_row.addEventListener("click",function() {
      if (this.expanded == false){
        pt_row_view_expand(this);
      }
    }, true);


  var ti_templates_DOM = document.getElementsByTagName("template").p_table_time_input_templates.content
  var ti_temp = ti_templates_DOM.querySelector(".c-ti-day");
  var ti_slots_temp = ti_templates_DOM.querySelector(".c-ti-slots")
  var ti_text_temp  = ti_templates_DOM.querySelector(".c-ti-text")

  for (var ti_date in static_definitions.ti_days) {
    if (!(static_definitions.ti_days[ti_date] == -1 || static_definitions.ti_days[ti_date].includes(parseInt(u_info.u_id[0])))){
      continue
    }

    new_ti = document.importNode(ti_temp, true)
    new_row.querySelector("#Zeiten .c-stablefield").appendChild(new_ti)

    var ti_type = ti_date.split("_")[1];
    
    if (ti_type === "WP"){
      new_ti.appendChild(document.importNode(ti_slots_temp, true))

      new_ti.querySelector("#slot_combined input").addEventListener("change",
        function(){
          if (this.checked){
            this.closest(".c-ti-slots-options").querySelector("#slot_walkin input").checked = false;
          }
      });
      new_ti.querySelector("#slot_walkin input").addEventListener("change",
        function(){
          if (this.checked){
            this.closest(".c-ti-slots-options").querySelector("#slot_combined input").checked = false;
          }
      });
    }
    else if (ti_type === "BT" || ti_type === "RZ"){
      new_ti.appendChild(document.importNode(ti_text_temp, true))
    }

    new_ti.id = ti_date
    new_ti.querySelector(".c-ti-head .ccb-label").innerHTML = TI_DATES_FORM[ti_date]

    ti_checkboxes = new_ti.querySelectorAll("input")
    for (var j = ti_checkboxes.length - 1; j >= 0; j--) {
      ti_checkboxes[j].disabled = "disabled";
    }
  }

  var tag_checkboxes = new_row.querySelectorAll("#Tags .c-tag label");
  for (var i = 0; i < tag_checkboxes.length; i++) {
    tag_checkboxes[i].querySelector("span").style.background = "";
    tag_checkboxes[i].querySelector("input").disabled = "disabled";
  }

  var tag_mA_checkboxes_input = new_row.querySelectorAll("#Tags .c-tag #mindest_Alter label input");
  for (var i = 0; i < tag_mA_checkboxes_input.length; i++) {
    tag_mA_checkboxes_input[i].addEventListener("input",function(){
      if (this.checked){
        var tag_mA = this.closest("#mindest_Alter");
        var all_inputs = tag_mA.querySelectorAll("#Tags .c-tag #mindest_Alter label input")
        for (var i = 0; i < all_inputs.length; i++) {
          if (this != all_inputs[i]){
            all_inputs[i].checked = false;
          }
        }
      }
    })
  }

  var Ort_radio_btns = new_row.querySelectorAll("#Ort label input");
  rnd_id = Math.random().toString().slice(2,10);
  Ort_radio_btns[0].name += rnd_id;
  Ort_radio_btns[1].name += rnd_id;
  Ort_radio_btns[0].addEventListener("input", pt_row_place_radio_react);
  Ort_radio_btns[1].addEventListener("input", pt_row_place_radio_react);
  pt_row_place_radio_react.call(Ort_radio_btns[0])

  pt_row_btn_init(new_row);

  return new_row;
}

function pt_row_adjust_access(rowdiv, p_id){
  var afields = Array.from(rowdiv.querySelectorAll(".c-ti-day.c-active"))
  afields.push(...rowdiv.querySelectorAll(".c-input.c-active"))

  rowdiv.edit_rights = false;
  rowdiv.del_rights  = rights_get_field_access(p_id,"Titel");

  for (var i = 0; i < afields.length; i++) {
    var parent = afields[i].closest(".c-field");
    var axx = rights_get_field_access(p_id,parent.id)
    switch (axx){
      case 1:
        rowdiv.edit_rights = true;
        break;
      case 0:
        afields[i].classList.remove("c-active");
        break;
      case -1:
        parent.style.display = "none";
    }
  }
  return;
}

function pt_row_add_new(tablediv){
  var new_row = pt_row_create_new();
  p_id = pt_new_p_id()
  new_row.id = p_id;
  new_row.querySelector("#row_id").innerHTML = p_id;

  var new_row_data = DEFAULT_ROW_DATA;
  new_row_data.Ausrichter = u_info.Name;
  pt_row_content_fill(new_row, new_row_data);
  tablediv.querySelector("#pt_body").appendChild(new_row);

  pt_row_adjust_access(new_row, p_id)
  pt_row_view_expand(new_row);
  pt_row_make_writable(new_row);
};

function pt_row_remove_final(rowdiv){
  var p_id = rowdiv.id;
  local_data[p_id]["meta"] =
    'Removed at ['+get_date_formated()+'] by user-id ['+u_info.u_id+']';

  rowdiv.parentElement.removeChild(rowdiv);

  data_to_server[p_id] = local_data[p_id];
  update_changes_to_server();
  update_debug_div();

  pt_all_tables_reset();
}

// ---- FILL / DEPARSE DATA ----

function pt_row_content_fill(rowdiv, rowdata){
  rowdiv.querySelector("#Titel .c-input").value = 
    rowdata.Titel;
  rowdiv.querySelector("#Kurztext .c-input").value = 
    rowdata.Kurztext;
  rowdiv.querySelector("#Langtext .c-input").value = 
    rowdata.Langtext;
  rowdiv.querySelector("#Geld_Anfrage .c-input").value = 
    rowdata.Geld_Anfrage;
  rowdiv.querySelector("#Geld_Limit .c-input").value = 
    rowdata.Geld_Limit;


  rowdiv.querySelector("#Ausrichter .c-input").innerHTML =
    rowdata.Ausrichter;
  // textareas = new_row.getElementsByTagName("textarea");
  // for (var i = textareas.length - 1; i >= 0; i--) {
  //   console.log(textareas[i])
  //   adjust_textarea_height(textareas[i]);
  // }

  // console.log(rowdata.Ausrichter);

  // tags
  pt_row_content_tags_fill(rowdiv, rowdata);

  // places
  pt_row_content_place_fill(rowdiv.querySelector("#Ort"), rowdata);

  rowdiv.querySelector("#tooltip_meta").innerHTML = rowdata.meta || "";

  var p_id = rowdiv.id;

  for (ti_date in static_definitions.ti_days){
    if (!(static_definitions.ti_days[ti_date] == -1 || p_id in static_definitions.ti_days[ti_date])){
      continue
    }

    pt_row_content_time_fill(rowdiv.querySelector("#"+ti_date), rowdata[ti_date])
  }

}

function pt_row_content_tags_fill(rowdiv, rowdata){
  var tags_div = rowdiv.querySelector("#Tags.c-active");
  var true_tags_list = (rowdata.Tags||"").split(":");

  var tags_names = ["International", "mit_Anmeldung", "Hinweise"];
  for (var i = 0; i < tags_names.length; i++) {
    if (list_contains_element(true_tags_list, tags_names[i])){
      tags_div.querySelector("#"+tags_names[i]+" input").checked = true;
    }
  }

  var tag_mAs = ["mA_10", "mA_13", "mA_16"];
  for (var i = 0; i < tag_mAs.length; i++) {
    if (list_contains_element(true_tags_list,tag_mAs[i])){
      tags_div.querySelector("#mindest_Alter #"+tag_mAs[i]+" input").checked = true;
    };
  }
}

function pt_row_content_place_fill(place_div, rowdata){
  var [type, cstmstr] = (rowdata.Ort || "std").split("%");
  place_div.querySelector("#Ort_std label input").checked  = (type=="std");
  place_div.querySelector("#Ort_cstm label input").checked = (type=="cstm");
  place_div.querySelector("#Ort_cstm #cstmstr_Ort_x").value = cstmstr || "";
  place_div.querySelector("#Ort_std #Lagergrund").innerHTML ="Lagergrund von "+rowdata.Ausrichter;
}

function pt_row_content_time_fill(ti_day_div, ti_data_string = ""){
  if (!ti_data_string){
    ti_day_div.querySelector("input").checked = false;
    c_colldiv_toggle(ti_day_div.querySelector(".c-colldiv"), false);
    return;
  }

  ti_day_div.querySelector("input").checked = true;
  c_colldiv_toggle(ti_day_div.querySelector(".c-colldiv"), true);

  var ti_type = ti_day_div.id.split("_")[1];
  if (ti_type=="WP"){
    pt_row_content_time_fill_slots(ti_day_div, ti_data_string);
  } else if (ti_type=="BT"||ti_type=="RZ"){
    pt_row_content_time_fill_text(ti_day_div, ti_data_string);
  }

}

function pt_row_content_time_fill_slots(ti_day_div, ti_data_string){
  var ti_prefix = ti_data_string.split("%")[0];
  var ti_slots = ti_data_string.split("%")[1].split(",")
  if (ti_slots == [ "" ]){
    return;
  }

  ti_day_div.querySelector("#slot_combined input").checked = (ti_prefix=="c");
  ti_day_div.querySelector("#slot_walkin   input").checked = (ti_prefix=="w");

  // console.log(ti_prefix, ti_slots);
  for (var i = 1; i <= 6; i++) {
    ti_day_div.querySelector("#slot_"+i+" input").checked = false;
  }
  for (var j = 0; j < ti_slots.length; j++) {
    i = Number(ti_slots[j])
    ti_day_div.querySelector("#slot_"+i+" input").checked = true;
  }
}

function pt_row_content_time_fill_text(ti_day_div, ti_data_string){
  ti_day_div.querySelector("#ti_text").value = ti_data_string.split("%")[1];
}

// ---- CONTENT DATA EVAL / PARSING ---- //
function pt_row_content_eval(rowdiv){
  // remove_breaks(rowdiv);

  var data_extract = {};
  var valid_input = true;

  var base_field_names = ['Titel', 'Kurztext', 'Langtext', 'Ausrichter', 'Geld_Anfrage', 'Geld_Limit'];
  for (var i = 0; i < base_field_names.length; i++) {
    var ifield = rowdiv.querySelector("#"+base_field_names[i]+" .c-input.c-active");
    if (ifield){
      data_extract[base_field_names[i]] = ifield.value
    }
  }

  // places
  try {
    data_extract["Ort"] = pt_row_content_place_eval(rowdiv);
  } catch {
    valid_input = false;
    console.log("Invalid 'Ort' input");
  }

  // tags
  try {
    data_extract["Tags"] = pt_row_content_tags_eval(rowdiv);
  } catch {
    valid_input = false;
    console.log("Invalid 'Tags' input");
  }


  if (!data_extract.Titel){
    valid_input = false;
  }

  // Time stuff
  var ti_day_divs = rowdiv.getElementsByClassName("c-ti-day")
  for (var i = ti_day_divs.length - 1; i >= 0; i--) {
    try {
      data_extract[ti_day_divs[i].id] = pt_row_content_time_eval(ti_day_divs[i]);
      // console.log(data_extract[ti_day_divs[i].id])
    } catch {
      valid_input = false;
      console.log("Invalid 'Zeiten' input")
    }
  }

  if (valid_input) {
    return data_extract;
  } else {
    return false;
  }
}

function pt_row_content_tags_eval(rowdiv){
  var tags_div = rowdiv.querySelector("#Tags.c-active");
  var tags_encode;
  var true_tags_list = [];
  var tags_names = ["International", "mit_Anmeldung", "Hinweise"]
  for (var i = 0; i < tags_names.length; i++) {
    if (tags_div.querySelector("#"+tags_names[i]+" input").checked){
      true_tags_list.push(tags_names[i]);
    }
  }

  var tag_mAs = ["mA_10", "mA_13", "mA_16"];
  for (var i = 0; i < tag_mAs.length; i++) {
    if (tags_div.querySelector("#mindest_Alter #"+tag_mAs[i]+" input").checked){
      true_tags_list.push(tag_mAs[i]);
    }
  }

  return ":"+true_tags_list.join(":")+":";
}

function pt_row_content_place_eval(rowdiv){
  var place_div = rowdiv.querySelector("#Ort.c-active");
  var place_encode;
  if (place_div.querySelector("#Ort_std label input").checked){
    place_encode = "std%";
  } else if (place_div.querySelector("#Ort_cstm label input").checked){
    place_encode = "cstm%" + place_div.querySelector("#Ort_cstm #cstmstr_Ort_x").value;
  }
  return place_encode;
}

function pt_row_content_time_eval(ti_day_div){
  var ti_active = ti_day_div.querySelector("input").checked
  if (!ti_active){
    return null;
  }

  var ti_type = ti_day_div.id.split("_")[1];

  if (ti_type=="WP"){
    return pt_row_content_time_eval_slots(ti_day_div);
  } else if (ti_type=="BT"||ti_type=="RZ"){
    return pt_row_content_time_eval_text(ti_day_div);
  }
}

function pt_row_content_time_eval_slots(ti_day_div){
  var slot_combined = ti_day_div.querySelector("#slot_combined input").checked;
  var slot_walkin   = ti_day_div.querySelector("#slot_walkin   input").checked;
  var ti_prefix = slot_walkin  ?"w":(slot_combined?"c":"s")

  var slot_select   = [];
  for (var j = 1; j <= 6; j++) {
    var chk_slot = ti_day_div.querySelector("#slot_"+j+" input").checked;
    if (chk_slot){
      slot_select.push(j);
    }
  }
  if (slot_select.length == 0){
    return null;
  }

  var ti_encoded = ti_prefix+'%' + slot_select.join(",") ;
  return ti_encoded;
}

function pt_row_content_time_eval_text(ti_day_div){
  var ti_prefix = "t";

  var ti_text = ti_day_div.querySelector("#ti_text").value;
  if (ti_text.length >= 4){
    // TODO add more sophisticated logic here or replace it with start-end input
    var ti_encoded = ti_prefix+'%' + ti_text ;
    return ti_encoded;
  }
  else{
    return null;
  }

}



// ---- CONTEXT OPTIONS ---- //
function pt_row_remove(rowdiv){
  // could add some disclaimer-warning etc
  pt_row_remove_final(rowdiv);
}

function pt_row_undo_changes(rowdiv){
  p_id = rowdiv.id;
  pt_row_content_fill(rowdiv, local_data[p_id]);
  pt_row_btn_update(rowdiv);
}

function pt_row_save_changes(rowdiv){
  p_id = rowdiv.id; 
  data_extract = pt_row_content_eval(rowdiv);
  if (data_extract == false){
    console.log(' >> not saving row, abort');
    return;
  }
  if (!(p_id in local_data)){
    local_data[p_id] = {};
  }

  for (var field in data_extract) {
    local_data[p_id][field] = data_extract[field];
  }
  pt_row_make_static(rowdiv);

  local_data[p_id]["meta"] =
    'Modified at ['+get_date_formated()+'] by user-id ['+u_info.u_id+']';

  rowdiv.querySelector("#tooltip_meta").innerHTML = local_data[p_id]["meta"];

  data_to_server[p_id] = local_data[p_id];
  update_changes_to_server();
  update_debug_div();

  pt_all_tables_reset.call(rowdiv);
  pt_row_btn_update(rowdiv);
}

// ---- SUBFUNCTIONS ---- //
function pt_row_make_writable(rowdiv) {
  rowdiv.style.height = "auto"
  var inputfields = rowdiv.querySelectorAll(".c-input.c-active");
  for (var i = inputfields.length - 1; i >= 0; i--) {
    inputfields[i].readOnly = false;
  }

  // ccb
  // time
  var time_input_subdivs = rowdiv.querySelectorAll(".c-ti-day.c-active")
  for (var i = time_input_subdivs.length - 1; i >= 0; i--) {
    // time_input_subdivs[i].querySelector(".c-ti-day .c-ti-head .ccb-checkmark-hover").style.background = "white"
    // time_input_subdivs[i].querySelector(".c-ti-body .w3-border").style.background = "white";
    var checkboxes = time_input_subdivs[i].getElementsByTagName("input")
    for (var j = checkboxes.length - 1; j >= 0; j--) {
      checkboxes[j].disabled = ""
    }
    var textbox = time_input_subdivs[i].querySelector(".c-ti-text input")
    if (textbox){
      textbox.readOnly = false;
    }
  }
  // place
  var place_radio_btns = rowdiv.querySelectorAll("#Ort.c-active label");
  rowdiv.querySelector("#Ort").readOnly = false;
  for (var i = place_radio_btns.length - 1; i >= 0; i--) {
    place_radio_btns[i].querySelector("input").disabled = ""
    place_radio_btns[i].querySelector("span").style.background = "white";
  }
  pt_row_place_radio_react.call(place_radio_btns[0]);
  // tags
  var tag_checkboxes = rowdiv.querySelectorAll(".c-active#Tags .c-tag label");
  for (var i = 0; i < tag_checkboxes.length; i++) {
    tag_checkboxes[i].querySelector("span").style.background = "white";
    tag_checkboxes[i].querySelector("input").disabled = "";
  }

  // cross-function feature
  rowdiv.writable = true;
  rowdiv.setAttribute("writable","true");
  pt_row_btn_update(rowdiv);
}

function pt_row_make_static(rowdiv) {
  var inputfields = rowdiv.getElementsByClassName("c-input");
  for (var i = inputfields.length - 1; i >= 0; i--) {
    inputfields[i].readOnly = true;
  }

  // ccb
  var time_input_subdivs = rowdiv.getElementsByClassName("c-ti-day")
  for (var i = time_input_subdivs.length - 1; i >= 0; i--) {
    // time_input_subdivs[i].querySelector(".c-ti-day .c-ti-head .ccb-checkmark-hover").style.background ="none";
    // time_input_subdivs[i].querySelector(".c-ti-body .w3-border").style.background ="none";;
    checkboxes = time_input_subdivs[i].getElementsByTagName("input")
    for (var j = checkboxes.length - 1; j >= 0; j--) {
      if (checkboxes[j].type == "checkbox"){
        checkboxes[j].disabled = "disabled";
      }
    }
    var textbox = time_input_subdivs[i].querySelector(".c-ti-text input")
    if (textbox){
      textbox.readOnly = true;
    }
  }
  // places
  var place_radio_btns = rowdiv.querySelectorAll("#Ort label");
  rowdiv.querySelector("#Ort").readOnly = true;
  var i_chk;
  for (var i = place_radio_btns.length - 1; i >= 0; i--) {
    // hack in oder to avoid changability
    var checked = place_radio_btns[i].querySelector("input").checked;
    place_radio_btns[i].querySelector("input").disabled =
      !checked;
    if (checked){i_chk = i};
    place_radio_btns[i].querySelector("span").style.background = "";
  }
  place_radio_btns[i_chk].querySelector("input").checked = true;
  pt_row_place_radio_react.call(place_radio_btns[0]);
  // tags
  var tag_checkboxes = rowdiv.querySelectorAll("#Tags .c-tag label");
  for (var i = 0; i < tag_checkboxes.length; i++) {
    tag_checkboxes[i].querySelector("span").style.background = "";
    tag_checkboxes[i].querySelector("input").disabled = "disabled";
  }


  rowdiv.writable = false;
  rowdiv.setAttribute("writable","false")

  pt_row_btn_update(rowdiv);
}





// ---- CONTEXT BUTTONS ---- //
function pt_row_btn_init(row){
  var btn_close   = row.querySelector("#btn_close");
  var btn_edit  = row.querySelector("#btn_edit");
  var btn_undo  = row.querySelector("#btn_undo");
  var btn_done  = row.querySelector("#btn_done");
  var btn_delete  = row.querySelector("#btn_delete");

  btn_close.onclick = function() {if (this.active){
    pt_row_view_collapse(this.closest('.c-rrow'))}
  };
  btn_edit.onclick = function() {if (this.active){
    pt_row_make_writable(this.closest('.c-rrow'))}
  };
  btn_undo.onclick = function() {if (this.active){
    pt_row_undo_changes(this.closest('.c-rrow'))}
  };
  btn_done.onclick = function() {if (this.active){
    pt_row_save_changes(this.closest('.c-rrow'))}
  };
  btn_delete.onclick = function() {if (this.active){
    pt_row_remove(this.closest('.c-rrow'))}
  };

  btn_close.active = false;
  btn_edit.active = false;
  btn_undo.active = false;
  btn_done.active = false;
  btn_delete.active = false;
}

function pt_row_btn_update(row){
  var btn_close   = row.querySelector("#btn_close");
  var btn_edit  = row.querySelector("#btn_edit");
  var btn_undo  = row.querySelector("#btn_undo");
  var btn_done  = row.querySelector("#btn_done");
  var btn_delete  = row.querySelector("#btn_delete");

  var is_new_row = !(row.id in local_data);

  btn_close.active  = (!is_new_row && row.expanded);
  btn_delete.active = (row.expanded && row.del_rights);
  btn_done.active   = (row.expanded && row.writable  && row.edit_rights);
  btn_edit.active   = (row.expanded && !row.writable && row.edit_rights);
  btn_undo.active   = (row.expanded && row.writable && !is_new_row && row.edit_rights);

  var btns = row.getElementsByClassName("context-icons");
  for (var i = 0; i < btns.length; i++) {
    pt_row_btn_adjust_visual(btns[i]);
  }
}

function pt_row_btn_adjust_visual(btn){
  if (btn.active){
    btn.classList.remove("w3-opacity-max");
    // btn.classList.remove("w3-hover-text-white")
    btn.classList.add("w3-hover-green");
    btn.classList.remove("w3-hover-light-grey")
  } else {
    btn.classList.add("w3-opacity-max");
    // btn.classList.add("w3-hover-text-white")
    btn.classList.remove("w3-hover-green");
    btn.classList.add("w3-hover-light-grey")

  }
}

// ---- COLLAPSING ---- //
function pt_row_view_expand(rowdiv){
  // console.log("expanding");
  rowdiv.style.height = rowdiv.children[0].scrollHeight + 'px';
  // console.log(row.style.height)
  var cols = rowdiv.getElementsByClassName("c-stable");
  var tier2cols = rowdiv.getElementsByClassName("c-tier2");
  var fileds = rowdiv.getElementsByClassName("c-stablefield");
  var heads = rowdiv.getElementsByClassName("c-stablehead");
  var inputs = rowdiv.getElementsByClassName("c-input");
  for (var i = cols.length - 1; i >= 0; i--) {
    cols[i].classList.replace("w3-col", "w3-row-padding");
    cols[i].classList.add("c-padding");
    fileds[i].classList.add("w3-col");
    heads[i].classList.replace("w3-hide", "w3-col");
  }
  for (var i = tier2cols.length - 1; i >= 0; i--) {
    tier2cols[i].classList.remove("w3-hide");
  }
  for (var i = inputs.length - 1; i >= 0; i--) {
    inputs[i].classList.replace("w3-border-0", "w3-border")
  }

  var ti_day_divs = rowdiv.getElementsByClassName("c-ti-day")
  for (var i = ti_day_divs.length - 1; i >= 0; i--) {
    c_colldiv_toggle(ti_day_divs[i].querySelector(".c-colldiv"),
                    ti_day_divs[i].querySelector("input").checked,
                    true)
  }

  // rowdiv.classList.replace("w3-hover-blue","w3-light-grey");
  rowdiv.classList.replace("w3-border-white", "w3-border-blue");

  rowdiv.style.height = rowdiv.children[0].scrollHeight + 'px';
  // console.log(row.style.height)
  rowdiv.expanded = true;
  rowdiv.setAttribute("expanded","true")
  pt_row_btn_update(rowdiv);
}

function pt_row_view_collapse(rowdiv){
  // console.log("collapsing");
  pt_row_make_static(rowdiv);
  rowdiv.style.height = rowdiv.children[0].scrollHeight + 'px';
  var cols = rowdiv.getElementsByClassName("c-stable");
  var tier2cols = rowdiv.getElementsByClassName("c-tier2");
  var fileds = rowdiv.getElementsByClassName("c-stablefield");
  var heads = rowdiv.getElementsByClassName("c-stablehead");
  var inputs = rowdiv.getElementsByClassName("c-input");
  for (var i = cols.length - 1; i >= 0; i--) {
    cols[i].classList.replace("w3-row-padding", "w3-col");
    cols[i].classList.remove("c-padding");
    fileds[i].classList.remove("w3-col");
    heads[i].classList.replace("w3-col", "w3-hide");
  }
  for (var i = tier2cols.length - 1; i >= 0; i--) {
    tier2cols[i].classList.add("w3-hide");
  }
  for (var i = inputs.length - 1; i >= 0; i--) {
    inputs[i].classList.replace("w3-border", "w3-border-0")
  }
  // rowdiv.classList.replace("w3-light-grey", "w3-hover-blue");
  rowdiv.classList.replace("w3-border-blue", "w3-border-white");


  rowdiv.style.height = rowdiv.children[0].scrollHeight + 'px';

  rowdiv.expanded = false;
  rowdiv.setAttribute("expanded","false")

}

function pt_row_view_toggle(rowdiv){
  if (rowdiv.expanded) {
    pt_row_view_collapse(rowdiv);
  } else {
    pt_row_view_expand(rowdiv);
  }
};


// ---- INPUT TYPE FUNCTIONALITIES ---- //
function adjust_textarea_height(textarea){
  textarea.style.height =  'auto';
  textarea.style.height = textarea.scrollHeight+3+'px';
}

function remove_breaks(rowdiv){
  value = rowdiv.querySelector("#Titel").getElementsByClassName("c-input")[0].value;
  value = value.replace("\n"," ");
  rowdiv.querySelector("#Titel").getElementsByClassName("c-input")[0].value = value;
}


// ---- MISC ---- //
function pt_row_place_radio_react(){
  var place_field = this.closest("#Ort");
  place_field.querySelector("#Ort_cstm #cstmstr_Ort_x").readOnly = !(
    place_field.querySelector("#Ort_cstm label input").checked &&
    !place_field.readOnly)
}

