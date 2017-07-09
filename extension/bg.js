var Loki = require('lokijs');
var request = require('superagent');

function createContextMenus() {
  var parent = chrome.contextMenus.create({
    'title': 'Patch',
    'contexts': ['page', 'selection', 'link', 'editable', 'image']
  });
  var addFacet = chrome.contextMenus.create({
    'title': 'Add facet',
    'id': 'edit',
    'parentId': parent,
    'contexts': ['page', 'selection', 'link', 'editable', 'image']
  });
  var remove = chrome.contextMenus.create({
    'title': 'Remove',
    'id': 'remove',
    'parentId': parent,
    'contexts': ['page', 'selection', 'link', 'editable', 'image']
  });
}
0

function loadContentScriptInAllTabs() {
  chrome.windows.getAll({ 'populate': true }, function(windows) {
    for (var i = 0; i < windows.length; i++) {
      var tabs = windows[i].tabs;
      for (var j = 0; j < tabs.length; j++) {
        chrome.tabs.executeScript(
          tabs[j].id, { file: './build/content.js', allFrames: true });
      }
    }
  });
}

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == 'edit') {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { 'type': 'edit' }, function(response) {});
    });
  } else if (info.menuItemId == 'remove') {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { 'type': 'remove' }, function(response) {});
    });
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.operation == 'addFacet') {
      saveFacet(request.facet, sender.tabs.url);
    }
  });

function saveFacet(facet, url) {
  // TODO: Check if the user alrady has a prism for current URL

  request
    .post('https://localhost:11111/facet')
    .send(facet)
    .end(function(err, res) {
      console.log(res);
    });
}

function createAndFillDB() {
  var db = new Loki('prism');
  var prisms = db.addCollection('prisms');

  chrome.tabs.query({}, function(tabs) {
    var allTabURLs = [];

    for (var i = tabs.length - 1; i >= 0; i--) {
      allTabURLs.push(tabs[i].url);
    }

    request
      .get('https://localhost:11111/prism')
      .query({ URL: JSON.stringify(allTabURLs) })
      .end(function(err, res) {
        if (err == null) {
          prisms.insert(res.body);
        }
      });
  });
}

(function init() {
  createAndFillDB();
  createContextMenus();
  loadContentScriptInAllTabs();
})();
