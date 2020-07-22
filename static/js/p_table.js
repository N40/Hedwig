// ---- USER fUNCTIONS ---- //
function init_tables() {
  table_tmp = document.getElementsByTagName("template")[0].content.querySelector("#tmp_pt_main");

  // #Eigen
  try{
    var is_admin = (u_info.u_id[0]=="0");
  } catch {
    var is_admin = false;
  }
  if (!is_admin){
  new_table = document.importNode(table_tmp, true);
  new_table.id = "Mein_Programm";
  new_table.querySelector("#btn_row_add_new").classList.toggle("w3-hide");
  new_table.querySelector("#btn_row_add_new").addEventListener("click", function(){
    pt_row_add_new(this.closest(".c-ptable"));
  })
  document.getElementsByClassName("c-bodydiv")["Programmeditor"].querySelector("#Mein_Programm").appendChild(new_table)
  }

  // #Wahlprogramm
  new_table = document.importNode(table_tmp, true);
  new_table.id = "Wahlprogramm";
  document.getElementsByClassName("c-bodydiv")["Programmeditor"].querySelector("#Wahlprogramm").appendChild(new_table)

  // #Ringezeit
  new_table = document.importNode(table_tmp, true);
  new_table.id = "Ringezeit";
  document.getElementsByClassName("c-bodydiv")["Programmeditor"].querySelector("#Ringezeit").appendChild(new_table)

  // #Besuchertag
  new_table = document.importNode(table_tmp, true);
  new_table.id = "Besuchertag";
  document.getElementsByClassName("c-bodydiv")["Programmeditor"].querySelector("#Besuchertag").appendChild(new_table)


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




// ---- FUNCTIONALITY SECTION ---- //
function pt_table_init(tablediv, data_object) {
  var table_body = tablediv.querySelector("#pt_body");
  while (table_body.firstChild) {
    table_body.removeChild(table_body.lastChild);
  }
  // var row_tmp = document.getElementsByTagName("template")[0].content.querySelector("#tmp_p_tablerow");
  for (var p_id in data_object) {
    // var new_row = document.importNode(row_tmp, true);
    if (data_object[p_id].meta.split(" ")[0] == "Removed"){
      continue;
    }

    new_row = pt_row_create_new();
    new_row.id = p_id;
    new_row.querySelector("#row_id").innerHTML = p_id;
    // new_row.expanded = false;
    pt_row_content_fill(new_row, data_object[p_id]);
    pt_row_adjust_access(new_row, p_id);
    table_body.appendChild(new_row);
  }
}

function pt_table_reset(tablediv){
  var row_divs = tablediv.getElementsByClassName("c-rrow")
  for (var i = row_divs.length - 1; i >= 0; i--) {
    pt_row_undo_changes(row_divs[i])
  }
}



// ---- MISC ----

function pt_new_p_id(){
  var u_id = u_info.u_id;
  var new_p_id = u_id+'.'+parseInt(36*(1+35*Math.random())).toString(36);
  while(new_p_id in local_data)
    new_p_id = u_id+'.'+parseInt(36*(1+35*Math.random())).toString(36);
  return new_p_id  
}



