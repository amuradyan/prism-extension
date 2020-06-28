import Operation from './operation'
import OperationResult from './operation_result'
import HttpStatusCodes from 'http-status-codes'

const Loki = require('lokijs')
const request = require('superagent')
const PrismFactory = require('../types/prism.js')
const FacetFactory = require('../types/facet.js')

const db = new Loki('prism')
const prisms = db.addCollection('prisms')

const prismBackend = 'http://localhost:8080/'
const prismDomain = 'http://prism.io'

let currentUser

function createContextMenus() {
  const parent = chrome.contextMenus.create({
    'title': 'Patch',
    'contexts': ['page', 'selection', 'link', 'editable', 'image']
  })
  chrome.contextMenus.create({
    'title': 'Patch section',
    'id': Operation.CONTEXT_MENU.PATCH_SECTION,
    'parentId': parent,
    'contexts': ['selection']
  })
  chrome.contextMenus.create({
    'title': 'Add note',
    'id': Operation.CONTEXT_MENU.ADD_NOTE,
    'parentId': parent,
    'contexts': ['page', 'selection', 'link', 'editable', 'image']
  })
  chrome.contextMenus.create({
    'title': 'Remove selection',
    'id': Operation.CONTEXT_MENU.REMOVE_SECTION,
    'parentId': parent,
    'contexts': ['selection']
  })
}

function loadContentScriptInAllTabs() {
  chrome.windows.getAll({
    'populate': true
  }, function (windows) {
    windows.forEach(w => {
      w.tabs.forEach(tab => {
        if (!tab.url.substring('chrome://'))
          chrome.tabs.executeScript(
            tabs.id, {
              file: './build/content.js',
              allFrames: true
            })
      })
    })
  })
}

function addCtxMenuListeners() {
  chrome.contextMenus.onClicked.addListener(function (info, tab) {
    const menuItemId = info.menuItemId.toUpperCase()
    if (Operation.CONTEXT_MENU[menuItemId] !== undefined) {
      chrome.tabs.sendMessage(tab.id, {
        type: Operation.CONTEXT_MENU[menuItemId]
      })      
    } else {
      console.error('Not our menu item: ', menuItemId)
    }
  })
}

function addChromeMessageListeners() {
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      console.log(request)
      console.log(sender)
      
      switch (request.operation) {
        case Operation.FACET.ADD_FACET:
          saveFacet(request.payload, sender.tab.url)
          break
        case Operation.USER.LOGIN:
          if (!currentUser) {
            console.log('No user logged in. Logging in now with ', request.payload)
            login(request.payload)
          } else {
            console.log('Already logged in')
            chrome.runtime.sendMessage({
              operation: OperationResult.LOGIN.SUCCESS,
              payload: {
                cool: 'cool'
              }
            }, function (response) {
              console.log(response)
            })
          }
          break
        case Operation.USER.REGISTER:
          register(request.payload)
          break
        case Operation.USER.FORGOT_PASSWORD:
          requestNewPassword(request.payload)
          break
        case Operation.USER.LOGOUT:
          logout()
          break
        default:
          console.error(`Unknown message: ${request.operation}`)
          break
      }
    })
}

function logout() {
  currentUser = null
  chrome.cookies.remove({
    url: prismDomain,
    name: 'credentials'
  }, function () {
    console.log('Removed prism credentials from cookies')
  })
}

function storeCredentialsToCookies(username, password) {
  const cookie = {
    url: prismDomain,
    name: 'credentials',
    value: JSON.stringify({
      username: username,
      password: password
    }),
  }

  chrome.cookies.set(cookie, function (c) {
    if (c) {
      console.log('Cookie stored for user' + username)
    } else {
      console.log('Unable to store cookie for user' + username)
    }
  })
}

function loginreq(username, password) {
  console.log('Logging in with credentials : ', username, password)
  request
    .post(prismBackend + 'tokens')
    .send({
      handle: username,
      passwordHash: password
    })
    .end(function (err, res) {
      console.log(res);
      
      if (res.statusCode === HttpStatusCodes.CREATED) {
        currentUser = res.body.pld['_id']
        createAndFillDB(currentUser)

        chrome.runtime.sendMessage({
          operation: OperationResult.LOGIN.SUCCESS,
          payload: {
            cool: 'cool'
          }
        }, function (response) {
          console.log(response)
        })

        jwt = res.body.tkn
        console.log('Success', res.body)
      } else {
        console.log('Error', err)
        chrome.runtime.sendMessage({
          operation: OperationResult.LOGIN.FAILURE,
          payload: {
            cool: 'not cool'
          }
        }, function (response) {
          console.log(response)
        })
      }
    })
}

function register(userSpec) {
  console.log('registering user : ', userSpec)
  request
    .post(prismBackend + 'users')
    .send(userSpec)
    .end(function (err, res) {
      if (ers && res.statusCode === HttpStatusCodes.CREATED) {
        console.log('Success', res)
        chrome.runtime.sendMessage({
          operation: OperationResult.REGISTER.SUCCESS,
          payload: {
            cool: 'cool'
          }
        })
        loginreq(userSpec.handle, userSpec.passwordHash)
      } else {
        console.log('Error', err)
        chrome.runtime.sendMessage({
          operation: OperationResult.REGISTER.FAILURE,
          payload: {
            cool: 'not cool'
          }
        })
      }
    })
}

function login(credentials) {
  if (isEmpty(credentials)) {
    chrome.cookies.get({
      url: prismDomain,
      name: 'credentials'
    }, function (cookie) {
      if (cookie) {
        credentials = JSON.parse(cookie.value)
        console.log('Prism credentials cookie found ', credentials)
        loginreq(credentials.username, credentials.password)
      } else {
        console.log('No cookies found for prism')
      }
    })
  } else {
    if (credentials.rememberMe === true) {
      storeCredentialsToCookies(credentials.username, credentials.password)
    }
    loginreq(credentials.username, credentials.password)
  }
}

function requestNewPassword(email) {
  console.log(email)
}

function saveFacet(rawFacet, url) {
  const facet = FacetFactory.createFacet(rawFacet.name, rawFacet.source,
    rawFacet.replacement, rawFacet.topics, rawFacet.state, currentUser)

  let prism = prisms.findOne({url})

  if (prism == null) {
    prism = PrismFactory.createPrism(url, facet, currentUser)
    console.log(prism, currentUser)
    prisms.insert(prism)
  } else {
    // This will automatically update the Loki since, I assume, it references 
    // THE object. If the line below is uncommented the same facet will be 
    // added twice.
    prism.addFacet(facet)
    // prisms.findAndUpdate({url: url}, e => e.addFacet(facet))
  }

  const cleanPrism = cleanLokiMeta(prism)

  request
    .put(prismBackend + 'users/' + currentUser + '/prisms')
    .send(cleanPrism)
    .end(function (err, res) {
      console.log('Response for saving facet')
      console.log(res)
    })
}

function cleanLokiMeta(prism) {
  // Loki js brings along two fields after read 'meta' and '$loki'
  // Have to strip it off :(
  const cleanPrism = Object.assign({}, prism)

  delete cleanPrism['meta']
  delete cleanPrism['$loki']

  return cleanPrism
}

function createAndFillDB(userId) {
  chrome.tabs.query({}, function (tabs) {
    const allTabURLs = []
    console.log(tabs);
    
    tabs.forEach(tab => {
      if (tab.url.substring('chrome://') !== -1)
        if (prisms.findOne({
            url: tab.url
          }) == null)
          allTabURLs.push(tab.url)
    })

    request
      .get(prismBackend + 'users/' + userId + '/prisms')
      .query({
        URLs: JSON.stringify(allTabURLs)
      })
      .end(function (err, res) {
        if (err === null) {
          res.body.forEach((e) => {
            console.log(e)
            prisms.insert(PrismFactory.createPrismFromDBResult(e))
          })
        } else console.log(err)
      })
  })
}

function fetchPrismForURL(url) {
  if (prisms.findOne({
      url: url
    }) == null) {
    request
      .get(prismBackend + 'prism')
      .query({
        URLs: JSON.stringify(url)
      })
      .end(function (err, res) {
        if (res.statusCode === HttpStatusCodes.SUCCESS) {
          console.log('Fetched prism for ' + url)
          res.body.forEach(e => {
            console.log('Prism: ' + e)
            prisms.insert(PrismFactory.createPrismFromDBResult(e))
          })
          console.log(res.body)
        }
      })
  }
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

//////////////////////// Init code
(function init() {
  createContextMenus()
  addCtxMenuListeners()
  loadContentScriptInAllTabs()
  addChromeMessageListeners()
})()