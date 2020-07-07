// ---- USER fUNCTIONS ---- //
function init_tables() {
  table_tmp = document.getElementsByTagName("template")[0].content.querySelector("#tmp_pt_main");

  // #Eigen
  new_table = document.importNode(table_tmp, true);
  new_table.id = "Mein_Programm";
  new_table.querySelector("#btn_row_add_new").classList.toggle("w3-hide");
  new_table.querySelector("#btn_row_add_new").addEventListener("click", function(){
    pt_row_add_new(this.closest(".c-ptable"));
  })
  document.getElementsByClassName("c-bodydiv")["Programmeditor"].querySelector("#Mein_Programm").appendChild(new_table)

  // #Wahlprogramm
  new_table = document.importNode(table_tmp, true);
  new_table.id = "Wahlprogramm";
  document.getElementsByClassName("c-bodydiv")["Programmeditor"].querySelector("#Wahlprogramm").appendChild(new_table)

  pt_all_tables_reset();
  
}

function pt_all_tables_reset(){
  var active_table;
  try{
    active_table = this.closest(".c-ptable");
  } catch {
    active_table = null;
  }

  var ptables = document.getElementsByClassName("c-ptable");
  for (var i = 0; i < ptables.length; i++) {
    if(ptables[i] === active_table){
      continue;
    }

    pt_table_init(ptables[i], PT_DATA_BIND[ptables[i].id]());
  }
}

// ---- DATA MANIP ----- //
function extract_data(level = "Eigen"){
  if (level == "GL"){
    return local_data;
  }
  if (!u_info){return;}

  ret_data = {}
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


// function init_tablerows(){
//   var tablerows = document.getElementsByClassName("c-rrow");
//   for (var i = tablerows.length - 1; i >= 0; i--) {
//     // tablerows[i].expanded = false;
//     tablerows[i].addEventListener("click",function() {
//       if (this.expanded == false){
//         pt_row_view_expand(this);
//       }
//     }, true);
//   }
// }


// GLOBAL VARIABLES
var PT_DATA_BIND = {
  "Mein_Programm": ()=>extract_data("Eigen"),
  "Wahlprogramm":  ()=>extract_data("GL"),
}

var TI_DATES = {
  "Z_WP_05_08": "Wahlprogramm, 05.08",
  "Z_WP_11_08": "Wahlprogramm, 11.08",
  "Z_BT_08_08": "Besuchertag, 08.08",
  "Z_RZ_06_08": "Ringezeit, 06.08",
  "Z_RZ_10_08": "Ringezeit, 10.08"
}

var DEFAULT_ROW_DATA = {
  "Titel": "",
  "Kurztext": "",
  "Langtext": "",
}

// ---- FUNCTIONALITY SECTION ---- //
function pt_table_init(tablediv, data_object) {
  var table_body = tablediv.querySelector("#pt_body");
  while (table_body.firstChild) {
    table_body.removeChild(table_body.lastChild);
  }
  // var row_tmp = document.getElementsByTagName("template")[0].content.querySelector("#tmp_p_tablerow");
  for (var p_id in data_object) {
    // var new_row = document.importNode(row_tmp, true);
    new_row = pt_row_create_new();
    new_row.id = p_id;
    new_row.querySelector("#row_id").innerHTML = p_id;
    // new_row.expanded = false;
    pt_row_content_fill(new_row, data_object[p_id]);
    table_body.appendChild(new_row);
  }
}

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

  for (var ti_date in TI_DATES) {

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
    new_ti.querySelector(".c-ti-head .ccb-label").innerHTML = TI_DATES[ti_date]

    ti_checkboxes = new_ti.querySelectorAll("input")
    for (var j = ti_checkboxes.length - 1; j >= 0; j--) {
      ti_checkboxes[j].disabled = "disabled"
    }


  }

  pt_row_btn_init(new_row);

  return new_row

}


function pt_row_content_fill(rowdiv, rowdata){
  rowdiv.querySelector("#Titel").getElementsByClassName("c-input")[0].value = 
    rowdata.Titel;
  rowdiv.querySelector("#Kurztext").getElementsByClassName("c-input")[0].value = 
    rowdata.Kurztext;
  rowdiv.querySelector("#Langtext").getElementsByClassName("c-input")[0].value = 
    rowdata.Langtext;

  // textareas = new_row.getElementsByTagName("textarea");
  // for (var i = textareas.length - 1; i >= 0; i--) {
  //   console.log(textareas[i])
  //   adjust_textarea_height(textareas[i]);
  // }

  for (ti_date in TI_DATES){
    pt_row_content_time_fill(rowdiv.querySelector("#"+ti_date), rowdata[ti_date])
  }

}



function pt_row_add_new(tablediv){
  var new_row = pt_row_create_new();
  p_id = u_info.u_id + '.xx';
  new_row.id = p_id;
  new_row.querySelector("#row_id").innerHTML = p_id;
  pt_row_content_fill(new_row, DEFAULT_ROW_DATA);
  tablediv.querySelector("#pt_body").appendChild(new_row);

  pt_row_view_expand(new_row);
  pt_row_make_writable(new_row);
};

function pt_row_remove(rowdiv){
  local_data[rowdiv.id].Titel = "%% removed %%";
  rowdiv.parentElement.removeChild(rowdiv);
}

function pt_row_undo_changes(rowdiv){
  p_id = rowdiv.id;
  pt_row_content_fill(rowdiv, local_data[p_id]);
  pt_row_btn_update(rowdiv);
}

function reset_table(tablediv){
  // deprecated i guess
  var row_divs = tablediv.getElementsByClassName("c-rrow")
  for (var i = row_divs.length - 1; i >= 0; i--) {
    pt_row_undo_changes(row_divs[i])
  }
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

  data_to_server[p_id] = local_data[p_id];
  update_changes_to_server();
  update_debug_div();

  pt_all_tables_reset.call(rowdiv);
  pt_row_btn_update(rowdiv);
}

function pt_row_make_writable(rowdiv) {
  rowdiv.style.height = "auto"
  var inputfields = rowdiv.getElementsByClassName("c-input");
  for (var i = inputfields.length - 1; i >= 0; i--) {
    inputfields[i].readOnly = false;
  }

  // ccb
  var time_input_subdivs = rowdiv.getElementsByClassName("c-ti-day")
  for (var i = time_input_subdivs.length - 1; i >= 0; i--) {
    time_input_subdivs[i].querySelector(".c-ti-day .c-ti-head .ccb-checkmark-hover").style.background = "white"
    time_input_subdivs[i].querySelector(".c-ti-body .w3-border").style.background = "white";
    checkboxes = time_input_subdivs[i].getElementsByTagName("input")
    for (var j = checkboxes.length - 1; j >= 0; j--) {
      checkboxes[j].disabled = ""
    }
  }

  // cross-function feature
  rowdiv.writable = true;
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
    time_input_subdivs[i].querySelector(".c-ti-day .c-ti-head .ccb-checkmark-hover").style.background ="none";
    time_input_subdivs[i].querySelector(".c-ti-body .w3-border").style.background ="none";;
    checkboxes = time_input_subdivs[i].getElementsByTagName("input")
    for (var j = checkboxes.length - 1; j >= 0; j--) {
      if (checkboxes[j].type == "checkbox"){
        checkboxes[j].disabled = "disabled";
      }
    }
  }

  rowdiv.writable = false;
  pt_row_btn_update(rowdiv);
}


function pt_row_content_eval(rowdiv){
  // remove_breaks(rowdiv);

  var data_extract = {};
  var valid_input = true;

  data_extract.Titel = 
    rowdiv.querySelector("#Titel").getElementsByClassName("c-input")[0].value;
  data_extract.Kurztext =
    rowdiv.querySelector("#Kurztext").getElementsByClassName("c-input")[0].value;
  data_extract.Langtext =
    rowdiv.querySelector("#Langtext").getElementsByClassName("c-input")[0].value;

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
    }
  }

  if (valid_input) {
    return data_extract;
  } else {
    return false;
  }
}

function pt_row_content_time_eval(ti_day_div){
  var ti_active = ti_day_div.querySelector("input").checked
  if (!ti_active){
    return null;
  }

  var ti_type = ti_day_div.id.split("_")[1];

  if (ti_type=="WP"){
    return pt_row_content_time_eva_slots(ti_day_div);
  } else if (ti_type=="BT"||ti_type=="RZ"){
    return pt_row_content_time_eva_text(ti_day_div);
  }
}

function pt_row_content_time_eva_slots(ti_day_div){
  var slot_combined = ti_day_div.querySelector("#slot_combined input").checked;
  var slot_walkin   = ti_day_div.querySelector("#slot_walkin   input").checked;
  var ti_prefix = slot_walkin  ?"w":(slot_combined?"c":"s")

  var slot_select   = []
  for (var j = 1; j <= 6; j++) {
    var chk_slot = ti_day_div.querySelector("#slot_"+j+" input").checked;
    if (chk_slot){
      slot_select.push(j);
    }
  }

  var ti_encoded = ti_prefix+'%' + slot_select.join(",") ;
  return ti_encoded;
}

function pt_row_content_time_eva_text(ti_day_div){
  var ti_prefix = "t";

  var ti_text = ti_day_div.querySelector("#ti_text").value;
  if (ti_text.length >= 4){
    // TODO add more sophisticated logic here or replace it with start-end input
    var ti_encoded = ti_prefix+'%' + ti_text ;
    return ti_encoded;
  }

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

// BUTTON UPDATING
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
  btn_delete.active = (row.expanded);
  btn_done.active   = (row.expanded && row.writable);
  btn_edit.active   = (row.expanded && !row.writable);
  btn_undo.active   = (row.expanded && row.writable && !is_new_row);

  var btns = row.getElementsByClassName("context-icons");
  for (var i = 0; i < btns.length; i++) {
    pt_row_btn_adjust_visual(btns[i]);
  }
}

function pt_row_btn_adjust_visual(btn){
  if (btn.active){
    btn.classList.remove("w3-text-grey");
    btn.classList.remove("w3-hover-text-white")
    btn.classList.add("w3-hover-green");
  } else {
    btn.classList.add("w3-text-grey");
    btn.classList.add("w3-hover-text-white")
    btn.classList.remove("w3-hover-green");

  }
}

// Collapsing
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
    cols[i].classList.add("w3-padding-small");
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

  rowdiv.classList.replace("w3-hover-blue","w3-light-grey");
  rowdiv.style.height = rowdiv.children[0].scrollHeight + 'px';
  // console.log(row.style.height)
  rowdiv.expanded = true;
  pt_row_btn_update(rowdiv);
}

function pt_row_view_collapse(rowdiv){
  console.log("collapsing");
  pt_row_make_static(rowdiv);
  rowdiv.style.height = rowdiv.children[0].scrollHeight + 'px';
  var cols = rowdiv.getElementsByClassName("c-stable");
  var tier2cols = rowdiv.getElementsByClassName("c-tier2");
  var fileds = rowdiv.getElementsByClassName("c-stablefield");
  var heads = rowdiv.getElementsByClassName("c-stablehead");
  var inputs = rowdiv.getElementsByClassName("c-input");
  for (var i = cols.length - 1; i >= 0; i--) {
    cols[i].classList.replace("w3-row-padding", "w3-col");
    cols[i].classList.remove("w3-padding-small");
    fileds[i].classList.remove("w3-col");
    heads[i].classList.replace("w3-col", "w3-hide");
  }
  for (var i = tier2cols.length - 1; i >= 0; i--) {
    tier2cols[i].classList.add("w3-hide");
  }
  for (var i = inputs.length - 1; i >= 0; i--) {
    inputs[i].classList.replace("w3-border", "w3-border-0")
  }
  rowdiv.classList.replace("w3-light-grey", "w3-hover-blue");

  rowdiv.style.height = rowdiv.children[0].scrollHeight + 'px';

  rowdiv.expanded = false;
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
