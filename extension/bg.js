function createContextMenus() {
  var parent = chrome.contextMenus.create({"title": "Patch",
    "contexts":["page","selection","link","editable","image"]});
  var child1 = chrome.contextMenus.create({"title": "Add patch", "parentId": parent, "onclick": sendPatchPrequest,
    "contexts":["page","selection","link","editable","image"]});
  var child2 = chrome.contextMenus.create({"title": "Add note", "parentId": parent, "onclick": sendNoteRequest,
    "contexts":["page","selection","link","editable","image"]});
} 

function loadContentScriptInAllTabs() {
  chrome.windows.getAll({'populate': true}, function(windows) {
    for (var i = 0; i < windows.length; i++) {
      var tabs = windows[i].tabs;
      for (var j = 0; j < tabs.length; j++) {
        chrome.tabs.executeScript(
            tabs[j].id,
            {file: 'brush.js', allFrames: true});
      }
    }
  });
}

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
});

function sendPatchPrequest() {
  chrome.tabs.getSelected(null, function(tab) {
      chrome.tabs.sendRequest(tab.id, {"type":"patch"});
  }); 
}

function sendNoteRequest() {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendRequest(tab.id, {"type":"note"});
}); 
}

(function init(){
  createContextMenus()
  loadContentScriptInAllTabs()
 })()