function openModal(data) {

  var modal = document.getElementById('popup_modal');
  var patchView = document.getElementById('patch_body');
  var noteView = document.getElementById('note_body');
  var error_text = document.getElementById('error_text');
  var note_text = document.getElementById('note_text');
  console.log(data);

  modal.style.display = "block"; /* Hidden by default */

  if(data.type == "patch"){
    patchView.style.display = "block";
    noteView.style.display = "none";
    error_text.innerHTML = data.text;
  } else if(data.type == "note"){
    patchView.style.display = "none";
    noteView.style.display = "block";
    note_text.innerHTML = data.text;
  }
}

window.onclick = function(event) {
    var modal = document.getElementById('popup_modal');

    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function closeModal() {
  var modal = document.getElementById('popup_modal');
  modal.style.display = "none";
}

function addModal () { 

  // Patch section
  var popupModal = document.createElement('div'); 
  popupModal.setAttribute('id', 'popup_modal');
  popupModal.innerHTML = "<div id='popup_body'>" +
" <div>" +
"   <span>Prism </span>" +
"   <span id='close' style='float: right'>X</span>" +
" </div>" +
" <div id='patch_body'>" +
"   Error" +
"   <textarea id='error_text'></textarea>" +
"   Patch" +
"   <textarea id='patch_text'></textarea>" +
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
"   <input type='text'>" +
"   <button id='save'>Save</button>" +
"   <button id='cancel'>Cancel</button>" +
" </div>" +
" <div id='note_body'>" +
"   Note" +
"   <textarea id='note_text'></textarea>" +
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
"   <input type='text'>" +
"   <button id='save'>Save</button>" +
"   <button id='cancel'>Cancel</button>" +
" </div>" +
"</div>"

  document.body.append(popupModal); 
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

  chrome.extension.sendRequest({'selection': selectedText});
  return selectedText;
}

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
      if(request.type == "patch" || request.type == "note"){
		     openModal({type: request.type, text: getSelectedText()});
      } else {
		     console.log("Unknown request type");
      }
});

function addEventListeners() {
  document.getElementById('save').addEventListener('click', closeModal);
  document.getElementById('cancel').addEventListener('click', closeModal);
  document.getElementById('close').addEventListener('click', closeModal);
}

(function initContentScript() {
	addModal();
  addEventListeners();
})();