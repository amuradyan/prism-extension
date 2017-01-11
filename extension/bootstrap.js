var loki = require("lokijs");
var Facet = require('./facet.js')

var selection;

function addModal () { 

  // Patch section
  var popupModal = document.createElement('div'); 
  popupModal.setAttribute('id', 'popup_modal');
  popupModal.innerHTML = "<div id='popup_body'>" +
" <div>" +
"   <span>Prism facet</span>" +
"   <span id='close' style='float: right'>X</span>" +
" </div>" +
" <div id='facet_body'>" +
"   Error" +
"   <textarea id='error_text'></textarea>" +
"   Patch" +
"   <textarea id='patch_text'></textarea>" +
"   Save to " +
"   <select>" +
"     <option>View 1</option>" +
"     <option>View 2</option>" +
"     <option>View 3</option>" +
"     <option>View 4</option>" +
"     <option>View 5</option>" +
"     <option>View 6</option>" +
"   </select>" +
"   Facet type" +
"   <select>" +
"     <option>Active</option>" +
"     <option>Passive</option>" +
"   </select>" +
"   Topics" +
"   <input type='text'>" +
"   <button id='save'>Save</button>" +
"   <button id='cancel'>Cancel</button>" +
" </div>" +
"</div>"

  document.body.append(popupModal); 
}

// Event listeners
window.onclick = function(event) {
    var modal = document.getElementById('popup_modal');

    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function addEventListeners() {
  document.getElementById('save').addEventListener('click', savePatch);
  document.getElementById('cancel').addEventListener('click', closeModal);
  document.getElementById('close').addEventListener('click', closeModal);
}

function getSelectedText() {

  var focused = document.activeElement;
  selection = window.getSelection()
  var range = selection.getRangeAt(0)
  var startCon = range.startContainer
  var endCon = range.endContainer

  return selection.toString();
}

function savePatch() {
  var error_text = document.getElementById('error_text');
  var facet = new Facet(selection, error_text.innerHTML);
  chrome.extension.sendMessage({'operation': 'addFacet', 'facet': facet});
  closeModal();
}

function openModal(data) {
  if(data.type == 'facet') {
    var modal = document.getElementById('popup_modal');
    var patchView = document.getElementById('facet_body');
    var error_text = document.getElementById('error_text');

    modal.style.display = "block"; /* Hidden by default */
    patchView.style.display = "block";
    error_text.innerHTML = data.text;
  }
}

function closeModal() {
  var modal = document.getElementById('popup_modal');
  modal.style.display = "none";
}

chrome.extension.onMessage.addListener(
    function(request, sender, respFun) {
      console.log(request);
      if(request.type == "facet" || request.type == "removalFacet"){
         openModal({type: request.type, text: getSelectedText()});
      } else {
         console.log("Unknown request type");
      }
});

function init() {
  addModal();
  addEventListeners();
}

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    init();
    var db = new loki('example.db');
    var users = db.addCollection('users');
  }
}
