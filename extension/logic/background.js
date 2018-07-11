const Loki = require('lokijs');
const request = require('superagent');
const PrismFactory = require('../types/prism.js');
const FacetFactory = require('../types/facet.js');

let token = null
let currentUser = null

const prismURL = "http://prism.melbourne"

const db = new Loki('prism');
const prisms = db.addCollection('prisms');

const prismBackend = 'http://localhost:8080/';

const headers = {
  'Authorization': token
}

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
  chrome.windows.getAll({ 'populate': true }, function (windows) {
    for (var i = 0; i < windows.length; i++) {
      const tabs = windows[i].tabs;
      for (var j = 0; j < tabs.length; j++) {
        if (!tabs[j].url.substring('chrome://'))
          chrome.tabs.executeScript(
            tabs[j].id, { file: './content.js', allFrames: true });
      }
    }
  });
}

function addCtxMenuListeners() {
  chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === 'edit') {
      console.log('Facet edit');
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'edit' }, function (response) { });
      });
    } else if (info.menuItemId === 'remove') {
      console.log('Facet remove');
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'remove' }, function (response) { });
      });
    }
  });
}

function addChromeMessageListeners() {
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      switch (request.operation) {
        case 'add_facet':
          saveFacet(request.payload, sender.tab.url);
          break;
        case 'login':
          login(request.payload);
          break;
        case 'register':
          register(request.payload)
          break;
        case 'recover_password':
          recoverPassword(request.payload)
          break;
        case 'logout':
          logout();
          break;
        case 'login_status':
          const loginStatus = token !== null
          chrome.runtime.sendMessage({ operation: 'login_status', payload: { status: loginStatus } });
          break;
        default: console.error("Unknows message", request.operation)
      }
    }
  );
}

function logout() {
  currentUser = null;
  token = null
  chrome.cookies.remove({ url: prismURL, name: 'credentials' }, function () {
    console.log('Removed prism credentials from cookies');
  });

  chrome.runtime.sendMessage({operation: 'logout_success'})
}

function storeCredentialsToCookies(handle, password) {
  const cookie = {
    url: prismURL,
    name: 'credentials',
    value: JSON.stringify({
      handle: handle,
      password: password
    }),
  };

  chrome.cookies.set(cookie, function (c) {
    if (c)
      console.log('Cookie stored for user ' + handle);
    else
      console.log('Unable to store cookie for user ' + handle);
  });
}

function login(credentials) {
  console.log("Logging in with credentials : ", credentials.handle, credentials.password);

  const resolved = ({ body }) => {
    console.log("Received token", body.token)

    if (credentials.rememberMe === true) {
      storeCredentialsToCookies(credentials.handle, credentials.password);
    }

    token = body.token
    chrome.runtime.sendMessage({ operation: 'login_success' });
  }

  const rejected = (err) => {
    console.error("Error ", err.message)
  }

  request
    .post(prismBackend + 'tokens')
    .set(headers)
    .send({
      handle: credentials.handle,
      passwordHash: credentials.password
    })
    .then(resolved)
    .catch(rejected)
}

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

function getSelf() {
  console.log("Getting self");

  return request
    .get(prismBackend + 'users/me')
    .set('Authorization', token)
    .send({})
}

function register(userSpec) {
  console.log("registering user : ", userSpec);
  request
    .post(prismBackend + 'users')
    .send(userSpec)
    .end(function (err, res) {
      if (err === null) {
        console.log("Success", res);
      } else {
        console.log("Error", err);
      }
    });
}

function recoverPassword(email) {
  console.log(email);
}

function saveFacet(rawFacet, url) {
  const facet = FacetFactory.createFacet(rawFacet.name, rawFacet.source,
    rawFacet.replacement, rawFacet.topics, rawFacet.state, currentUser);

  var prism = prisms.findOne({ url: url })

  if (prism == null) {
    prism = PrismFactory.createPrism(url, facet, currentUser);
    console.log(prism, currentUser);
    prisms.insert(prism);
  } else {
    // This will automatically update the Loki since, I assume, it references 
    // THE object. If the line below is uncommented the same facet will be 
    // added twice.
    prism.addFacet(facet);
    // prisms.findAndUpdate({url: url}, e => e.addFacet(facet));
  }

  const cleanPrism = cleanLokiMeta(prism);

  request
    .put(prismBackend + 'users/' + currentUser + '/prisms')
    .send(cleanPrism)
    .end(function (err, res) {
      console.log('Response for saving facet');
      console.log(res);
    });
}

function cleanLokiMeta(prism) {
  // Loki js brings along two fields after read 'meta' and '$loki'
  // Have to strip it off :(
  const cleanPrism = Object.assign({}, prism);

  delete cleanPrism['meta'];
  delete cleanPrism['$loki'];

  return cleanPrism;
}

function createAndFillDB(userId) {
  chrome.tabs.query({}, function (tabs) {
    const allTabURLs = [];

    for (var i = tabs.length - 1; i >= 0; i--) {
      if (tabs[i].url.substring('chrome://') !== -1)
        if (prisms.findOne({ url: tabs[i].url }) == null)
          allTabURLs.push(tabs[i].url);
    }

    request
      .get(prismBackend + 'users/' + userId + '/prisms')
      .query({ URLs: JSON.stringify(allTabURLs) })
      .end(function (err, res) {
        if (err === null) {
          res.body.forEach((e) => {
            console.log(e);
            prisms.insert(PrismFactory.createPrismFromDBResult(e));
          });
        } else console.log(err)
      });
  });
}

function fetchPrismForURL(url) {
  if (prisms.findOne({ url: url }) == null) {
    request
      .get(prismBackend + 'prism')
      .query({ URLs: JSON.stringify(url) })
      .end(function (err, res) {
        if (err === null) {
          console.log('Fetched prism for ' + url);
          res.body.forEach(e => {
            console.log('Prism: ' + e);
            prisms.insert(PrismFactory.createPrismFromDBResult(e));
          });
          console.log(res.body);
        }
      });
  }
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

//////////////////////// Init code
(function init() {
  createContextMenus();
  addCtxMenuListeners();
  loadContentScriptInAllTabs();
  addChromeMessageListeners();

  chrome.cookies.get({ url: prismURL, name: 'credentials' }, function (cookie) {
    if (cookie) {
      credentials = JSON.parse(cookie.value);
      console.log('Prism credentials cookie found ', credentials);
      login(credentials)
    } else {
      console.log('No cookies found for prism');
    }
  });
})();
