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

function sendPatchPrequest() {
  // body...
}

function sendNoteRequest() {
  // body...
}

function createContextMenus() {
  var parent = chrome.contextMenus.create({"title": "Patch", "onclick": click,
    "contexts":["page","selection","link","editable","image"]});
  var child1 = chrome.contextMenus.create({"title": "Add patch", "parentId": parent, "onclick": click,
    "contexts":["page","selection","link","editable","image"]});
  var child2 = chrome.contextMenus.create({"title": "Add note", "parentId": parent, "onclick": click,
    "contexts":["page","selection","link","editable","image"]});
}

(function init(){
  createContextMenus()
  loadContentScriptInAllTabs()

  chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
      if (request['init']) {
        sendResponse({'key': localStorage['speakKey']});
      } else if (request['speak']) {
        speak(request['speak']);
      }
    });

  chrome.browserAction.onClicked.addListener(
      function(tab) {
        chrome.tabs.sendRequest(
            tab.id,
            {'speakSelection': true});
      });
})()