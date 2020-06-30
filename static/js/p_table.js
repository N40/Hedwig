// ---- USER fUNCTIONS ---- //
function init_tables() {
  table_tmp = document.getElementsByTagName("template")[0].content.querySelector("#tmp_p_tablebody");

  // #Eigen
  new_table = document.importNode(table_tmp, true);
  new_table.id = "Mein_Programm";
  new_table.querySelector("#add_row_btn").classList.toggle("w3-hide");
  document.getElementsByClassName("c-bodydiv")["Programmeditor"].querySelector("#Mein_Programm").appendChild(new_table)
  fill_table(new_table, extract_data("Eigen"));

  // #Wahlprogramm
  new_table = document.importNode(table_tmp, true);
  new_table.id = "Wahlprogramm";
  new_table.querySelector("#add_row_btn").classList.toggle("w3-hide");
  document.getElementsByClassName("c-bodydiv")["Programmeditor"].querySelector("#Wahlprogramm").appendChild(new_table)
  fill_table(new_table, extract_data("GL"));

  
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

// ---- FUNCTIONALITY SECTION ---- //

// function init_tablerows(){
//   var tablerows = document.getElementsByClassName("c-rrow");
//   for (var i = tablerows.length - 1; i >= 0; i--) {
//     // tablerows[i].expanded = false;
//     tablerows[i].addEventListener("click",function() {
//       if (this.expanded == false){
//         expand_tablerow(this);
//       }
//     }, true);
//   }
// }

var TI_DATES = {
  "Z_WP_05_08": "Wahlprogramm, 05.08",
  "Z_WP_11_08": "Wahlprogramm, 11.08"
}

function create_new_row(){
  row_tmp = document.getElementsByTagName("template")[0].content.querySelector("#tmp_p_tablerow");
  var new_row = document.importNode(row_tmp, true);
  new_row.expanded = false;
  new_row.addEventListener("click",function() {
      if (this.expanded == false){
        expand_tablerow(this);
      }
    }, true);


  ti_templates_DOM = document.getElementsByTagName("template").p_table_time_input_templates.content
  ti_temp = ti_templates_DOM.querySelector(".c-ti-day");
  ti_slots_temp = ti_templates_DOM.querySelector(".c-ti-slots")

  for (var ti_date in TI_DATES) {

    new_ti = document.importNode(ti_temp, true)
    new_row.querySelector("#Zeiten .c-stablefield").appendChild(new_ti)
    
    new_ti.appendChild(document.importNode(ti_slots_temp, true))
    new_ti.id = ti_date
    new_ti.querySelector(".c-ti-head .ccb-label").innerHTML = TI_DATES[ti_date]

    ti_checkboxes = new_ti.querySelectorAll("input")
    for (var j = ti_checkboxes.length - 1; j >= 0; j--) {
      ti_checkboxes[j].disabled = "disabled"
    }
  
    new_ti.querySelector("#slot_combined input").addEventListener("change",
      function(){
        if (this.checked){
          this.closest(".c-ti-slots-options").querySelector("#slot_walkin input").checked = false;
        }
    })
    new_ti.querySelector("#slot_walkin input").addEventListener("change",
      function(){
        if (this.checked){
          this.closest(".c-ti-slots-options").querySelector("#slot_combined input").checked = false;
        }
    })

  }

  return new_row

}

function fill_table(tablediv, data_object) {
  // var row_tmp = document.getElementsByTagName("template")[0].content.querySelector("#tmp_p_tablerow");
  for (var p_id in data_object) {
    // var new_row = document.importNode(row_tmp, true);
    new_row = create_new_row();
    new_row.id = p_id;
    new_row.querySelector("#row_id").innerHTML = p_id;
    // new_row.expanded = false;
    fill_row(new_row, data_object[p_id]);
    tablediv.appendChild(new_row);
  }
}


function fill_row(rowdiv, rowdata){
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
    parse_time_data(rowdiv.querySelector("#"+ti_date), rowdata[ti_date])
  }



}

var default_row_data = {
  "Titel": "",
  "Kurztext": "",
  "Langtext": "",
}

function add_new_row(tablediv){
  var new_row = create_new_row();
  p_id = '12.34.56'
  new_row.id = p_id;
  new_row.querySelector("#row_id").innerHTML = p_id;
  fill_row(new_row, default_row_data);
  tablediv.appendChild(new_row);

  expand_tablerow(new_row);
  make_writable(new_row);
};

function remove_row(rowdiv){
  local_data[rowdiv.id].Titel = "%% removed %%"
  rowdiv.parentElement.removeChild(rowdiv)
}

function undo_change(rowdiv){
  p_id = rowdiv.id;
  fill_row(rowdiv, local_data[p_id])
}

function reset_table(tablediv){
  var row_divs = tablediv.getElementsByClassName("c-rrow")
  for (var i = row_divs.length - 1; i >= 0; i--) {
    undo_change(row_divs[i])
  }
}

function save_row(rowdiv){
  p_id = rowdiv.id; 
  data_extract = eval_row(rowdiv);
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
  make_static(rowdiv);

  data_to_server[p_id] = local_data[p_id];
  update_changes_to_server();
  update_debug_div();

  ptables = document.getElementsByClassName("c-ptable")
  for (var i = ptables.length - 1; i >= 0; i--) {
    reset_table(ptables[i]);
  }
}

function make_writable(tablerow) {
  tablerow.style.height = "auto"
  var inputfields = tablerow.getElementsByClassName("c-input");
  for (var i = inputfields.length - 1; i >= 0; i--) {
    inputfields[i].readOnly = false;
  }

  // ccb
  var time_input_subdivs = tablerow.getElementsByClassName("c-ti-day")
  for (var i = time_input_subdivs.length - 1; i >= 0; i--) {
    time_input_subdivs[i].querySelector(".c-ti-day .c-ti-head .ccb-checkmark-hover").style.background = "white"
    time_input_subdivs[i].querySelector(".c-ti-body .w3-border").style.background = "white";
    checkboxes = time_input_subdivs[i].getElementsByTagName("input")
    for (var j = checkboxes.length - 1; j >= 0; j--) {
      checkboxes[j].disabled = ""
    }
  }
}

function make_static(tablerow) {
  var inputfields = tablerow.getElementsByClassName("c-input");
  for (var i = inputfields.length - 1; i >= 0; i--) {
    inputfields[i].readOnly = true;
  }

  // ccb
  var time_input_subdivs = tablerow.getElementsByClassName("c-ti-day")
  for (var i = time_input_subdivs.length - 1; i >= 0; i--) {
    time_input_subdivs[i].querySelector(".c-ti-day .c-ti-head .ccb-checkmark-hover").style.background ="none";
    time_input_subdivs[i].querySelector(".c-ti-body .w3-border").style.background ="none";;
    checkboxes = time_input_subdivs[i].getElementsByTagName("input")
    for (var j = checkboxes.length - 1; j >= 0; j--) {
      checkboxes[j].disabled = "disabled"
    }
  }
}

function remove_breaks(rowdiv){
  value = rowdiv.querySelector("#Titel").getElementsByClassName("c-input")[0].value;
  value = value.replace("\n"," ");
  rowdiv.querySelector("#Titel").getElementsByClassName("c-input")[0].value = value;
  

}

function eval_row(rowdiv){
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
      data_extract[ti_day_divs[i].id] = eval_time_input(ti_day_divs[i]);
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

function eval_time_input(ti_day_div){
  var ti_active = ti_day_div.querySelector("input").checked
  if (!ti_active){
    return null;
  }
  
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

  var ti_encoded = ti_prefix+':' + slot_select.join(",") ;
  return ti_encoded;
}

function parse_time_data(ti_day_div, ti_data_string = ""){
  if (!ti_data_string){
    ti_day_div.querySelector("input").checked = false;
    toggle_collapse(ti_day_div.querySelector(".c-colldiv"), false);
    return;
  }

  ti_day_div.querySelector("input").checked = true;
  toggle_collapse(ti_day_div.querySelector(".c-colldiv"), true);


  var ti_prefix = ti_data_string.split(":")[0];
  var ti_slots = ti_data_string.split(":")[1].split(",")
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

function expand_tablerow(row){
  // console.log("expanding");
  row.style.height = row.children[0].scrollHeight + 'px';
  // console.log(row.style.height)
  var cols = row.getElementsByClassName("c-stable");
  var tier2cols = row.getElementsByClassName("c-tier2");
  var fileds = row.getElementsByClassName("c-stablefield");
  var heads = row.getElementsByClassName("c-stablehead");
  var inputs = row.getElementsByClassName("c-input");
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

  var ti_day_divs = row.getElementsByClassName("c-ti-day")
  for (var i = ti_day_divs.length - 1; i >= 0; i--) {
    toggle_collapse(ti_day_divs[i].querySelector(".c-colldiv"),
                    ti_day_divs[i].querySelector("input").checked,
                    true)
  }

  row.classList.replace("w3-hover-blue","w3-light-grey");
  row.style.height = row.children[0].scrollHeight + 'px';
  // console.log(row.style.height)
  row.expanded = true;
}

function collapse_tablerow(row){
  console.log("collapsing");
  make_static(row);
  row.style.height = row.children[0].scrollHeight + 'px';
  var cols = row.getElementsByClassName("c-stable");
  var tier2cols = row.getElementsByClassName("c-tier2");
  var fileds = row.getElementsByClassName("c-stablefield");
  var heads = row.getElementsByClassName("c-stablehead");
  var inputs = row.getElementsByClassName("c-input");
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
  row.classList.replace("w3-light-grey", "w3-hover-blue");

  row.style.height = row.children[0].scrollHeight + 'px';

  row.expanded = false;
}

function toggle_tablerow(row){
  if (row.expanded) {
    collapse_tablerow(row);
  } else {
    expand_tablerow(row);
  }
};

// ---- INPUT TYPE FUNCTIONALITIES ---- //
function adjust_textarea_height(textarea){
  textarea.style.height =  'auto';
  textarea.style.height = textarea.scrollHeight+3+'px';
}

