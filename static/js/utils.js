function get_date_formated(){
  var date = new Date();
  var options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: "numeric"};
  return new Intl.DateTimeFormat('de-DE', options).format(date);
}

function get_date_formated_short(){
  var date = new Date();
  var options = { month: '2-digit', day: '2-digit', hour: 'numeric', minute: "numeric"};
  return new Intl.DateTimeFormat('de-DE', options).format(date);
}

function list_contains_element(array, element){
  for (var i = 0; i < array.length; i++) {
    if( array[i]==element){
      return true;
    }
  }
  return false;
}

function keys_from_object(object){
	var keys = [];
	for (var key in object){
		keys.push(key);
	}
	return keys
}