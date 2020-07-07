// This file is to be loaded upon main.html rendering.

// GLOBAL VARS
var pl_document = null;
var PL_FRAME_HTML = "<iframe class=\"pl_frame\" src=\"/pl_frame\" onload=\"pl_init_frame_dom()\">\n"+
			"gen placeholder\n" +
			"</iframe> "

// CLIENT FUNCTIONS
function pl_print_frame()
{
    var print_window = document.querySelector(".pl_frame").contentWindow;
    console.log(print_window);
    // print_window = window;
    print_window.print();
    print_window.close();

    return true;
}

function pl_init_frame(){
	var ifc = document.querySelector("#Listengenerator #iframe_container");
	ifc.innerHTML = PL_FRAME_HTML;
	ifc.style.height = window.innerHeight - ifc.offsetTop - 20 + "px";
}


function pl_init_frame_dom(){
	pl_document = document.querySelector(".pl_frame").contentDocument;
	console.log(pl_document)
}

// FUNCTIONALITIES
function pl_add_page(n = 3){
	pl_page_temp = pl_document.querySelector("template").content.querySelector(".pl_page")
	pl_page_titel_temp = pl_document.querySelector("template").content.querySelector(".pl_page_titel")
	
	new_pl_plage = pl_document.importNode(pl_page_temp, true);
	new_pl_subpage = new_pl_plage.querySelector(".pl_subpage")
	
	page_titel = pl_document.importNode(pl_page_titel_temp, true);
	new_pl_subpage.insertBefore(page_titel, new_pl_subpage.childNodes[0])

	pl_row_temp = pl_document.querySelector("template").content.querySelector(".pl_row")
	for (var i = 2; i >= 0; i--) {
		new_row = pl_document.importNode(pl_row_temp, true)
		new_pl_subpage.querySelector(".pl_subpage_content").appendChild(new_row)
	}

	for (p_id in local_data){
		new_row = pl_document.importNode(pl_row_temp, true)

		new_row.querySelector("#Id").innerHTML = p_id
		new_row.querySelector("#Titel").innerHTML = local_data[p_id].Titel
		new_row.querySelector("#Beschreibung").innerHTML = local_data[p_id].Langtext
		
		new_pl_subpage.querySelector(".pl_subpage_content").appendChild(new_row)
	}


	pl_document.body.appendChild(new_pl_plage)


	for (var i = 1; i < n; i++) {
		new_pl_plage = pl_document.importNode(pl_page_temp, true);
		pl_document.body.appendChild(new_pl_plage)
		
	}
}