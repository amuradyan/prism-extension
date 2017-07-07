function createContextMenus() {
  var parent = chrome.contextMenus.create({'title': 'Patch',
    'contexts':['page','selection','link','editable','image']});
  var addFacet = chrome.contextMenus.create({'title': 'Add facet', 'id': 'edit', 'parentId': parent,
    'contexts':['page','selection','link','editable','image']});
  var remove = chrome.contextMenus.create({'title': 'Remove', 'id': 'remove', 'parentId': parent,
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

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if(info.menuItemId == 'edit') {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {'type':'edit'}, function(response) {});  
    });
  } else if(info.menuItemId == 'remove') {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {'type':'remove'}, function(response) {});  
    });
  }
});

(function init(){
  createContextMenus()
  loadContentScriptInAllTabs()
 })()