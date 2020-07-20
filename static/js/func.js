// global variables
var last_server_time_str = undefined;

// DOM fuckery
function open_subpage(){
  var menudivs = document.getElementsByClassName("c-menudiv");
  var bodydivs = document.getElementsByClassName("c-bodydiv");
  for (var i = menudivs.length - 1; i >= 0; i--) {
    menudivs[i].classList.replace("w3-border-green","w3-border-white");
    bodydivs[menudivs[i].id].style.display = "none";  
    c_colldiv_toggle(menudivs[i].getElementsByClassName("c-colldiv")[0],0);
  }
  for (var i = bodydivs.length - 1; i >= 0; i--) {
    bodydivs[i].style.display = "none";
  }

  try{
    this.parentElement.classList.replace("w3-border-white","w3-border-green");
    bodydivs[this.parentElement.id].style.display = "block";
    c_colldiv_toggle(this.parentElement.getElementsByClassName("c-colldiv")[0],1);

  }
  catch {
  	// true;
    bodydivs["Home"].style.display = "block";
  }

};

function c_colldiv_toggle(coll_div, target=-1, sudden_expand = false){
  if (target <0){
    target = coll_div.style.maxHeight;
  } else {
    target = !target;
  }

  if (sudden_expand){
    coll_div.style.maxHeight = "unset";
  }

  if (target){
    coll_div.style.maxHeight = null;
  } else {
    coll_div.style.maxHeight = coll_div.scrollHeight + "px";
  }
};


function open_subsubpage(int_default = 0) {
  try {
    var submenudivs = this.closest(".c-menudiv").getElementsByClassName("c-submenudiv");
  } catch{
    return;
  }
  bodydiv = document.getElementsByClassName("c-bodydiv")[this.closest(".c-menudiv").id]
  var subbodydivs = bodydiv.getElementsByClassName("c-subbodydiv");
  // console.log(submenudivs)
  // console.log(subbodydivs)
  for (var i = submenudivs.length - 1; i >= 0; i--) {
    submenudivs[i].classList.replace("w3-border-blue","w3-border-white");
    try{
      subbodydivs[submenudivs[i].id].style.display = "none";  
    } catch {
      continue;
    }
  }

  try{
    this.closest(".c-submenudiv").classList.replace("w3-border-white","w3-border-blue");
    subbodydivs[this.closest(".c-submenudiv").id].style.display = "block"
  } catch {
    null;
  }
}

function w3_open_sidebar() {
  document.getElementById("sidebar").style.display = "block";
  document.getElementById("close_sidebar_click_area").style.display = "block";
  document.getElementById("close_sidebar_click_area").style.height =
    document.getElementById("sidebar").scrollHeight;
}

function w3_close_sidebar() {
  document.getElementById("sidebar").style.display = "none";
  document.getElementById("close_sidebar_click_area").style.display ="none";
}

// function w3_open_sidebar() {
//   document.getElementById("main_frame").style.marginLeft = "250px";
//   document.getElementById("sidebar").style.width = "250px";
//   document.getElementById("sidebar").style.display = "block";
//   // document.getElementById("openNav").style.display = 'none';
// }

// function w3_close_sidebar() {
//   document.getElementById("main_frame").style.marginLeft = "0%";
//   document.getElementById("sidebar").style.display = "none";
//   // document.getElementById("openNav").style.display = "inline-block";
// } 

// ---- Internal Updates ---- //
function update_server_status(callback = function(){return;}){
  ssdiv = document.getElementById("server_info_div");

  // initial
  ssdiv.querySelector("#status").classList.replace("w3-text-grey", "w3-text-0")
  ssdiv.querySelector("#sync_btn").classList.remove("w3-hide")

  update_changes_to_server();

  ajax_get("/get_server_time",function(response){
    document.getElementById("server_info_div").querySelector("#status").innerHTML
      = response;
      last_server_time_str = response;
      callback();
  });
}

function update_changes_to_server(){
  ssdiv = document.getElementById("server_info_div");

  no_pd_changes = Object.keys(data_to_server).length;
  if (no_pd_changes) {
    ssdiv.querySelector("#pd_changes").classList.remove("w3-hide")
    ssdiv.querySelector("#pd_changes").innerHTML = no_pd_changes+ " Programm-Änderungen"
  } else {
    ssdiv.querySelector("#pd_changes").classList.add("w3-hide")
  }

  no_ud_changes = Object.keys(user_dict_to_server).length;
  if (no_ud_changes) {
    ssdiv.querySelector("#ud_changes").classList.remove("w3-hide")
    ssdiv.querySelector("#ud_changes").innerHTML = no_ud_changes+ " Benutzer-Änderungen"
  } else {
    ssdiv.querySelector("#ud_changes").classList.add("w3-hide")
  }
}

function update_user_info(){
  uidiv = document.getElementById("u_info_div");
  uidiv.classList.remove("w3-hide");
  uidiv.querySelector("#u_name").innerHTML = u_info["Name"]
  uidiv.querySelector("#u_ul").innerHTML = "UL "+u_info["Unterlager"]
  uidiv.querySelector("#u_vb").innerHTML = u_info["Verband"]||"<i class='w3-small'>Verband?</i>"
}

function update_debug_div(){
  // console.log(data_from_server)
  var ddiv = document.getElementsByClassName("c-bodydiv")["Debugdiv"];
  ddiv.querySelector("#json_data_from_server").innerHTML
     = JSON.stringify(data_from_server, undefined, 2);
  ddiv.querySelector("#json_data_to_server").innerHTML
     = JSON.stringify(data_to_server, undefined, 2);
}

function post_sync(){
  ptables = document.getElementsByClassName("c-ptable")
  for (var i = ptables.length - 1; i >= 0; i--) {
    reset_table(ptables[i]);
  }

  update_user_info();
  update_server_status(function(){
    document.querySelector("#sync_btn").querySelector("i").classList.remove("w3-spin_bw");
  });
}


// ---- INIT STUFF ---- //
function init_navigation(){ 
  var menudivs = document.getElementsByClassName("c-menudiv");
  for (var i = menudivs.length - 1; i >= 0; i--) {
    menudivs[i].getElementsByClassName("w3-bar-item")[0].addEventListener("click",open_subpage);
  }

  var submenudivs = document.getElementsByClassName("c-submenudiv");
  for (var i = submenudivs.length - 1; i >= 0; i--) {
    submenudivs[i].getElementsByClassName("w3-bar-item")[0].addEventListener("click",open_subsubpage);
  }

  document.getElementById("close_sidebar_click_area").addEventListener("click", function(){
      w3_close_sidebar();
    }, true);

  subbodydivs = document.getElementsByClassName("c-subbodydiv");
  for (var i = subbodydivs.length - 1; i >= 0; i--) {
    subbodydivs[i].style.display = "none";
  }

}

function init_user_funcs(){
  window.addEventListener("beforeunload", function (event) {
    logout();
  });

  document.querySelector("#Debugdiv #auto_ping input").checked = false;

  var keyinputfield  =document.getElementById('keyinputfield');
  keyinputfield.addEventListener('keypress',  function (e) {
      if (e.keyCode == 13) {
          var key = keyinputfield.value;
          login(key);
      }
  });

  document.querySelector("#sync_btn").addEventListener("click",syncronize_full);

  document.querySelector("#logout_btn").addEventListener("click", logout)

  document.querySelector('#ukc_active_btn').addEventListener("click", init_ukc);

}

function init_ukc(){
  pull_user_dict();

  document.getElementById("ukc_creation_div").classList.remove("w3-hide");
  document.getElementById("ukc_table_div").classList.remove("w3-hide");
  document.getElementById("ukc_preamble_div").classList.add("w3-hide");
}

