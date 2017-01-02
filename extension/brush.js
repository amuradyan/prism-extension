function addModal () { 
  // create a new div element 
  // and give it some content 
  var newDiv = document.createElement("div"); 
  newDiv.setAttribute("id", "exo_modal");
  newDiv.innerHTML = "<div id=\"exo\">" +
" <div>" +
"   <span>Prism patch</span>" +
"   <span style=\"float: right\">X</span>" +
" </div>" +
" <div>" +
"   Error" +
"   <textarea>exo</textarea>" +
"   Patch" +
"   <textarea>hopar</textarea>" +
"   Save to " +
"   <select>" +
"     <option>1</option>" +
"     <option>2</option>" +
"     <option>3</option>" +
"     <option>4</option>" +
"     <option>5</option>" +
"     <option>6</option>" +
"   </select>" +
"   Topics" +
"   <input type=\"text\" placeholder=\"exoexo\">" +
"   <button>Save</button>" +
"   <button>Cancel</button>" +
" </div>" +
"</div>"

  document.body.append(newDiv); 
}

function getSelectedText() {
  var focused = document.activeElement;
  var selectedText;
  if (focused) {
    try {
      selectedText = focused.value.substring(
          focused.selectionStart, focused.selectionEnd);
    } catch (err) {
    }
  }
  if (selectedText == undefined) {
    var sel = window.getSelection();
    var selectedText = sel.toString();
  }

  console.log("Yo" + selectedText)
  chrome.extension.sendRequest({'selection': selectedText});
  return selectedText;
}

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        alert("Got it!");
        if(request.type == "patch"){
			alert("Patching" + getSelectedText());
        } else if(request.type == "note"){
			alert("Noting" + getSelectedText());
        }
});

(function initContentScript(argument) {
	addModal();
})();