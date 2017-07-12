const selectionSerializer = require('serialize-selection');
const popupModalHTML = require('html-loader!./popupModal.html');

var selection;

function addModal() {
  const popupModal = document.createElement('div');
  popupModal.setAttribute('id', 'popup_modal');
  popupModal.innerHTML = popupModalHTML;
  document.body.append(popupModal);
}

// Event listeners
window.onclick = function(event) {
  const modal = document.getElementById('popup_modal');

  if (event.target === modal) {
    modal.style.display = 'none';
  }
}

function addEventListeners() {
  document.getElementById('save').addEventListener('click', savePatch);
  document.getElementById('cancel').addEventListener('click', closeModal);
  document.getElementById('close').addEventListener('click', closeModal);
}

function saveFacet() {
  const name = document.getElementById('facet_name').value;
  const source = selectionSerializer.save();
  const replacement = document.getElementById('patch_text').value;
  const topics = populateTopicsArray(document.getElementById('facet_topics').value);
  const state = document.getElementById('facet_state').checked;

  const payload = {
    name,
    source,
    replacement,
    topics,
    state
  }

  chrome.runtime.sendMessage({ operation: 'addFacet', payload: payload }, function(response) {
    console.log(response);
  });
}

function populateTopicsArray(topicsString) {
  const topicsArray = topicsString.replace(/\s+/g, '').split(',');

  var topics = new Set(topicsArray);
  topics.delete('');

  return Array.from(topics);
}

function savePatch() {
  saveFacet();
  closeModal();
}

function openModal(selection) {
  const modal = document.getElementById('popup_modal');
  const patchView = document.getElementById('facet_body');
  const errorText = document.getElementById('error_text');

  modal.style.display = 'block'; /* Hidden by default */
  patchView.style.display = 'block';
  errorText.value = selection;
}

function closeModal() {
  // Resetting 'state'. Maybe there is a better way to this
  document.getElementById('facet_name').value = '';
  document.getElementById('error_text').value = '';
  document.getElementById('patch_text').value = '';
  document.getElementById('facet_topics').value = '';
  document.getElementById('facet_state').checked = true;

  const modal = document.getElementById('popup_modal');
  modal.style.display = 'none';
}

// Should be moved into users config at some point
const skipRemovalUI = true;

chrome.extension.onMessage.addListener(
  function(req, sender, respFun) {
    if (req.type === 'edit') {
      openModal(window.getSelection().toString());
    } else if (req.type === 'remove') {

      if (skipRemovalUI)
        saveFacet();
      else
        openModal(window.getSelection().toString());

    } else {
      console.log('Unknown request type');
    }
  });

//////////////////////// Init code
function init() {
  addModal();
  addEventListeners();

  chrome.runtime.sendMessage({ operation: 'ping' }, function(response) {
    console.log(response);
  });
}

document.onreadystatechange = function() {
  if (document.readyState === 'complete') {
    init();
  }
}
