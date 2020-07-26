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
function pl_render_page(){
    pl_document.body.innerHTML = '';

    var ul   = document.querySelector("#Listengenerator #ul_select").value;
    var date = document.querySelector("#Listengenerator #date_select").value;
    var type = document.querySelector("#Listengenerator #type_select").value;

    var data = local_data;
    if (ul != "all"){
        data = extract_data_by_ul(ul, data);
    }   
    if (date != "all"){
        data = extract_data_by_date(date, data);
    }
    if (type != "all"){
        data = extract_data_by_type(type, data);
    }

    pl_render_chapter_to_page(data, "Übersicht: Alles an Wahlprogramm")


}

function pl_render_chapter_to_page(data, titel="/"){
    var pl_page_temp       = pl_document.querySelector("template").content.querySelector(".pl_page");
    var pl_page_titel_temp = pl_document.querySelector("template").content.querySelector(".pl_page_titel");
    var pl_row_temp        = pl_document.querySelector("template").content.querySelector(".pl_row");

    if (!data){return;}

    var chapter = [];

    var active_page = pl_document.importNode(pl_page_temp, true);
    chapter.push(active_page);

    var page_titel  = pl_document.importNode(pl_page_titel_temp, true);
    page_titel.querySelector("h1").innerHTML = titel
    active_page.querySelector(".pl_subpage").insertBefore(page_titel,
        active_page.querySelector(".pl_subpage").children[0]);
    
    pl_document.body.appendChild(active_page);
    var active_container =  active_page.querySelector(".pl_subpage .pl_subpage_content");

    for (p_id in data){
        new_row = pl_document.importNode(pl_row_temp, true)

        new_row.querySelector("#Id").innerHTML = p_id
        new_row.querySelector("#Titel").innerHTML = data[p_id].Titel
        new_row.querySelector("#Beschreibung").innerHTML = data[p_id].Langtext
        pl_row_tags(new_row, local_data[p_id]);
        
        active_container.appendChild(new_row);

        var overflow = active_container.parentElement.scrollHeight -
                       active_container.parentElement.clientHeight;
        if (overflow > 0){
            active_container.removeChild(new_row);

            active_page = pl_document.importNode(pl_page_temp, true);
            chapter.push(active_page);

            pl_document.body.appendChild(active_page);
            active_container =  active_page.querySelector(".pl_subpage .pl_subpage_content");

            active_container.appendChild(new_row);
        }
    }

    set_meta_for_chapter(chapter, titel);
}

function set_meta_for_chapter(chapter, titel){
    var page_count = chapter.length;
    var time = get_date_formated_short();

    for (var i = 0; i < page_count; i++) {
        var meta_div = chapter[i].querySelector(".pl_page_metainfo");
        meta_div.querySelector("#pl_meta_pageNo").innerHTML = " "+(i+1)+" / "+page_count+" ";
        meta_div.querySelector("#pl_meta_Titel").innerHTML = titel;
        meta_div.querySelector("#pl_meta_time").innerHTML = time;
    }
}

var tag_reference = {
    "International":    "speaker_english_3",
    "Hinweise":         "warning_outline",
    "mit_Anmeldung":    "paper_strip_lock_vertical",
    "mA_6":             "person_CA_6J",
    "mA_10":            "person_CA_10J",
    "mA_13":            "person_CA_13J",
    "mA_16":            "person_CA_16J",
    "mA_18":            "person_CA_18J"
}

function pl_row_tags(rowdiv, rowdata){
    new_row.querySelector("#Tags").innerHTML = "";
    var true_tags_list = (rowdata.Tags||"").split(":");
    for (var i = 0; i < true_tags_list.length; i++) {
        if (true_tags_list[i]){
            new_row.querySelector("#Tags").innerHTML +=
                '<i class="my-icons pl_tags">'+
                    tag_reference[true_tags_list[i]]
                +'</i>\n';
        }
    }
}
