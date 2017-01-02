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
        alert("Back!");
        alert("Patching" + request.selection);
});

function sendPatchPrequest() {
  var modal = document.getElementById('exo_modal');
  alert(modal);
  var exo = document.getElementById('exo');
  modal.style.position = "absolute";
  modal.style.backgroundColor = "lightgray";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.opacity = "0.9";
  exo.style.display = "block";
  // console.log(modal);
  alert("patch2");
  // chrome.runtime.sendMessage("mnpgbgkfiiocopihnhnagkigjidhbmnb", {data: "data"});

  // chrome.tabs.getSelected(null, function(tab) {
  //     chrome.tabs.sendRequest(tab.id, {"type":"patch"});
  // }); 
}

function sendNoteRequest() {
  alert("Yo!")

  showPatchModal()
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendRequest(tab.id, {"type":"note"});
}); 
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