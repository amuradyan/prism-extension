var FacetFactory = require('./facet.js');
var PrismFactory = require('./prism.js');
var selectionSerializer = require('serialize-selection');
var popupModalHTML = require('html-loader!./popupModal.html');

var selection;

function addModal() {
  var popupModal = document.createElement('div');
  popupModal.setAttribute('id', 'popup_modal');
  popupModal.innerHTML = popupModalHTML;
  document.body.append(popupModal);
}

// Event listeners
window.onclick = function(event) {
  var modal = document.getElementById('popup_modal');

  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

function addEventListeners() {
  document.getElementById('save').addEventListener('click', savePatch);
  document.getElementById('cancel').addEventListener('click', closeModal);
  document.getElementById('close').addEventListener('click', closeModal);
}

function savePatch() {
  var errorText = document.getElementById('error_text');
  var facetSelectElem = document.getElementById('facet_types');
  var facetType = facetSelectElem.options[facetSelectElem.selectedIndex].text;

  var facet = FacetFactory.createFacet(selection, errorText.innerHTML, facetType);

  // Check if a prism for given URL does not exists
  var prism = PrismFactory.createPrism();


  selection = window.getSelection();
  var serSel = selectionSerializer.save();
  console.log(serSel);

  chrome.runtime.sendMessage({ operation: 'getTabName' }, function(response) {
    console.log(response);
  });

  const newFacet = FacetFactory.createFacet(serSel, '');

  chrome.runtime.sendMessage({ operation: 'addFacet', facet: newFacet }, function(response) {
    console.log(response);
  });

  closeModal();
}

function openModal() {
  var modal = document.getElementById('popup_modal');
  var patchView = document.getElementById('facet_body');
  var errorText = document.getElementById('error_text');
  var activeFacet = document.getElementById('active_facet');

  modal.style.display = 'block'; /* Hidden by default */
  patchView.style.display = 'block';
  errorText.innerHTML = selection.toString();
  activeFacet.selected = true;
}

function closeModal() {
  var modal = document.getElementById('popup_modal');
  modal.style.display = 'none';
}

chrome.extension.onMessage.addListener(
  function(req, sender, respFun) {
    if (req.type == 'edit') {
      openModal({ type: req.type, text: window.getSelection().toString() });
    } else if (req.type == 'remove') {
      savePatch();
    } else {
      console.log('Unknown request type');
    }
  });

function init() {
  addModal();
  addEventListeners();
}

document.onreadystatechange = function() {
  if (document.readyState === 'complete') {
    init();
  }
}
