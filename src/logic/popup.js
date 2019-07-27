import Operation from './operation'
import OperationResult from './operation_result'

const shajs = require('sha.js')

function initLoginView() {
  document.getElementById('lv_do_register').addEventListener('click', function () {
    document.getElementById('register_view').style.display = 'block'
    document.getElementById('login_view').style.display = 'none'
    document.getElementById('forgot_password_view').style.display = 'none'
    document.getElementById('forgot_password_view').style.display = 'none'
  })

  document.getElementById('lv_do_forgot_password').addEventListener('click', function () {
    document.getElementById('forgot_password_view').style.display = 'block'
    document.getElementById('register_view').style.display = 'none'
    document.getElementById('login_view').style.display = 'none'
  })

  document.getElementById('login').addEventListener('click', function () {
    const payload = {
      username: document.getElementById('username').value,
      password: new shajs('sha512').update(document.getElementById('password').value).digest('hex'),
      rememberMe: document.getElementById('remember_me').checked
    }

    chrome.runtime.sendMessage({
      operation: Operation.LOGIN,
      payload: payload
    })
  })
}

function initRegisterView() {
  document.getElementById('rv_do_login').addEventListener('click', function () {
    document.getElementById('login_view').style.display = 'block'
    document.getElementById('register_view').style.display = 'none'
    document.getElementById('forgot_password_view').style.display = 'none'
  })

  document.getElementById('rv_do_forgot_password').addEventListener('click', function () {
    document.getElementById('forgot_password_view').style.display = 'block'
    document.getElementById('register_view').style.display = 'none'
    document.getElementById('login_view').style.display = 'none'
  })

  document.getElementById('register').addEventListener('click', function () {
    const name = document.getElementById('name').value
    const surname = document.getElementById('surname').value
    const email = document.getElementById('reg_email').value
    const handle = document.getElementById('handle').value
    const regPassword = document.getElementById('reg_password').value
    const passwordHash = new shajs('sha512').update(regPassword).digest('hex')

    const payload = {
      name,
      surname,
      email,
      handle,
      passwordHash
    }

    chrome.runtime.sendMessage({
      operation: Operation.REGISTER,
      payload: payload
    })
  })
}

function initForgotPasswordView() {
  document.getElementById('fpv_do_login').addEventListener('click', function () {
    document.getElementById('login_view').style.display = 'block'
    document.getElementById('register_view').style.display = 'none'
    document.getElementById('forgot_password_view').style.display = 'none'
  })

  document.getElementById('fpv_do_register').addEventListener('click', function () {
    document.getElementById('register_view').style.display = 'block'
    document.getElementById('forgot_password_view').style.display = 'none'
    document.getElementById('login_view').style.display = 'none'
  })

  document.getElementById('req_password').addEventListener('click', function () {
    const email = document.getElementById('forgot_email').value
    const payload = {
      email
    }

    chrome.runtime.sendMessage({
      operation: Operation.FORGOT_PASSWORD,
      payload: payload
    }, function (response) {
      console.log(response)
    })
  })
}

function initLoggedInView() {
  document.getElementById('liv_do_logout').addEventListener('click', function () {
    document.getElementById('logged_in_view').style.display = 'none'
    document.getElementById('logged_out_view').style.display = 'block'

    chrome.runtime.sendMessage({
      operation: Operation.LOGOUT,
      payload: {}
    })
  })
}

function switchToLoggedInView() {
  document.getElementById('logged_in_view').style.display = 'block'
  document.getElementById('logged_out_view').style.display = 'none'
}

function init() {
  initLoginView()
  initRegisterView()
  initForgotPasswordView()
  initLoggedInView()

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      switch (request.operation) {
        case OperationResult.LOGIN.SUCCESS:
          switchToLoggedInView()
          break
        case OperationResult.LOGIN.FAILURE:
          document.getElementById('lv_login_failure').style.display = 'block'
          break
        case OperationResult.REGISTER.SUCCESS:
          switchToLoggedInView()
          break
        case OperationResult.REGISTER.FAILURE:
          document.getElementById('reg_failure').style.display = 'block'
          break
        default:
          console.error(`Unknown message: ${request.operation}`)
          break
      }
    })

  chrome.runtime.sendMessage({
    operation: Operation.LOGIN,
    payload: {}
  })
}

document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    init()
  }
}