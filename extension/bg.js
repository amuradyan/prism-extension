function createContextMenus() {
  var parent = chrome.contextMenus.create({'title': 'Patch',
    'contexts':['page','selection','link','editable','image']});
  var addFacet = chrome.contextMenus.create({'title': 'Add facet', 'id': 'facet', 'parentId': parent,
    'contexts':['page','selection','link','editable','image']});
  var remove = chrome.contextMenus.create({'title': 'Remove', 'id': 'removalFacet', 'parentId': parent,
    'contexts':['page','selection','link','editable','image']});
} 

function loadContentScriptInAllTabs() {
  chrome.windows.getAll({'populate': true}, function(windows) {
    for (var i = 0; i < windows.length; i++) {
      var tabs = windows[i].tabs;
      for (var j = 0; j < tabs.length; j++) {
        chrome.tabs.executeScript(
            tabs[j].id,
            {file: './build/content.js', allFrames: true});
      }
    }
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    alert(request.operation);
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if(info.menuItemId == 'facet') {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {'type':'facet'}, function(response) {});  
    });
  } else if(info.menuItemId == 'removalFacet') {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {'type':'removalFacet'}, function(response) {});  
    });
  }
});

(function init(){
  createContextMenus()
  loadContentScriptInAllTabs()
 })()