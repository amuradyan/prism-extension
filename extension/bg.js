const Loki = require('lokijs');
const request = require('superagent');

const db = new Loki('prism');
const prisms = db.addCollection('prisms');

function createContextMenus() {
  const parent = chrome.contextMenus.create({
    'title': 'Patch',
    'contexts': ['page', 'selection', 'link', 'editable', 'image']
  });
  const addFacet = chrome.contextMenus.create({
    'title': 'Add facet',
    'id': 'edit',
    'parentId': parent,
    'contexts': ['page', 'selection', 'link', 'editable', 'image']
  });
  const remove = chrome.contextMenus.create({
    'title': 'Remove',
    'id': 'remove',
    'parentId': parent,
    'contexts': ['page', 'selection', 'link', 'editable', 'image']
  });
}

function loadContentScriptInAllTabs() {
  chrome.windows.getAll({ 'populate': true }, function(windows) {
    for (var i = 0; i < windows.length; i++) {
      const tabs = windows[i].tabs;
      for (var j = 0; j < tabs.length; j++) {
        if(!tabs[j].url.substring('chrome://'))
          chrome.tabs.executeScript(
            tabs[j].id, { file: './build/content.js', allFrames: true });
      }
    }
  });
}

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === 'edit') {
    console.log('Facet edit');
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'edit' }, function(response) {});
    });
  } else if (info.menuItemId === 'remove') {
    console.log('Facet remove');
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'remove' }, function(response) {});
    });
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.operation === 'addFacet') {
      saveFacet(request.facet, sender.tab.url);
    } else if (request.operation === 'ping') {
      console.log('Fetching prism for ' + sender.tab.url);
      fetchPrismForURL(sender.tab.url);
      sendResponse('pong');
    }
});

function saveFacet(facet, url) {
  // TODO: Check if the user alrady has a prism for current URL

  console.log('Saving a facet')
  request
    .post('https://localhost:11111/facet')
    .send(facet)
    .end(function(err, res) {
      console.log('Response for saving facet');
      console.log(res);
    });
}

function createAndFillDB() {
  chrome.tabs.query({}, function(tabs) {
    const allTabURLs = [];

    for (var i = tabs.length - 1; i >= 0; i--) {
      if(tabs[i].url.substring('chrome://') !== -1)
        allTabURLs.push(tabs[i].url);
    }

    request
      .get('https://localhost:11111/prism')
      .query({ URLs: JSON.stringify(allTabURLs) })
      .end(function(err, res) {
        if (err === null) {
          res.body.forEach( (e) => { console.log(e); prisms.insert(e) });
        }
        else console.log(err)
      });
  });
}

function fetchPrismForURL(url) {
  request
    .get('https://localhost:11111/prism')
    .query({ URLs: JSON.stringify(url) })
    .end(function(err, res) {
        console.log('Fetched prism for ' + url);
      if (err === null) {
        res.body.forEach( (e) => { console.log(e); prisms.insert(e) });
        console.log(res.body);
      }
    });
}

//////////////////////// Init code
(function init() {
  createAndFillDB();
  createContextMenus();
  loadContentScriptInAllTabs();
})();
