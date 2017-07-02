var loki = require('lokijs');
var request = require('superagent');
var FacetFactory = require('./facet.js')
var PrismFactory = require('./prism.js')

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
"   Attach to " +
"   <select id='prism_list'>" +
"     <option>View 1</option>" +
"     <option>View 2</option>" +
"     <option>View 3</option>" +
"     <option>View 4</option>" +
"     <option>View 5</option>" +
"     <option>View 6</option>" +
"   </select>" +
"   Facet type" +
"   <select id='facet_types'>" +
"     <option id='active_facet'>Active</option>" +
"     <option id='passive_facet'>Passive</option>" +
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

function getSelection() {

  var focused = document.activeElement;
  selection = window.getSelection()
  var range = selection.getRangeAt(0)
  var startCon = range.startContainer
  var endCon = range.endContainer

  return selection;
}

function savePatch() {
  var errorText = document.getElementById('error_text');
  var facetSelectElem = document.getElementById('facet_types');
  var facetType = facetSelectElem.options[facetSelectElem.selectedIndex].text;

  var facet = FacetFactory.createFacet(selection, errorText.innerHTML, facetType);
  var prism = PrismFactory.createPrism();
  
  chrome.extension.sendMessage({'operation': 'addFacet', 'facet': facet});
  closeModal();
}

function openModal(data) {
  if(data.type == 'facet') {
    var modal = document.getElementById('popup_modal');
    var patchView = document.getElementById('facet_body');
    var errorText = document.getElementById('error_text');
    var activeFacet = document.getElementById('active_facet');

    modal.style.display = "block"; /* Hidden by default */
    patchView.style.display = "block";
    errorText.innerHTML = data.text;
    activeFacet.selected = true;
  } else {
    var passiveFacet = document.getElementById('passive_facet');
    passiveFacet.selected = true;
  }
}

function closeModal() {
  var modal = document.getElementById('popup_modal');
  modal.style.display = "none";
}

chrome.extension.onMessage.addListener(
    function(req, sender, respFun) {
      if(req.type == "facet" || req.type == "removalFacet"){
        request
          .get('https://localhost:11111/')
          .end(function (err, res) {
            console.log(res);
          });
        openModal({type: req.type, text: getSelectedText()});
        console.log(getSelection())
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
