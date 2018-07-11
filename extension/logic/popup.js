const shajs = require('sha.js');

function initLoginView() {
    document.getElementById('lv_do_register').addEventListener('click', function () {
        switchToRegisterView()
    });

    document.getElementById('lv_do_forgot_password').addEventListener('click', function () {
        switchToForgotPasswordView()
    });

    document.getElementById('login').addEventListener('click', function () {
        const payload = {
            handle: document.getElementById('username').value,
            password: new shajs('sha512').update(document.getElementById('password').value).digest('hex'),
            rememberMe: document.getElementById('remember_me').checked
        }

        chrome.runtime.sendMessage({ operation: 'login', payload: payload });
    });
}

function initRegisterView() {
    document.getElementById('rv_do_login').addEventListener('click', function () {
        switchToLoginView()
    });

    document.getElementById('rv_do_forgot_password').addEventListener('click', function () {
        switchToForgotPasswordView()
    });

    document.getElementById('register').addEventListener('click', function () {
        const name = document.getElementById('name').value;
        const surname = document.getElementById('surname').value;
        const email = document.getElementById('reg_email').value;
        const handle = document.getElementById('handle').value;
        const regPassword = document.getElementById('reg_password').value;
        const passwordHash = new shajs('sha512').update(regPassword).digest('hex');

        const payload = {
            name,
            surname,
            email,
            handle,
            passwordHash
        };

        chrome.runtime.sendMessage({ operation: 'register', payload: payload });
    });
}

function initErrorMessageField() {
    document.getElementById('error_msg').addEventListener('blur', function (event) {
        event.target.style.display = 'none'
    });

    document.getElementById('error_msg').addEventListener('focus', function (event) {
        event.target.style.display = 'block'
    });
}

function initForgotPasswordView() {
    document.getElementById('fpv_do_login').addEventListener('click', function () {
        switchToLoginView()
    });

    document.getElementById('fpv_do_register').addEventListener('click', function () {
        switchToForgotPasswordView()
    });

    document.getElementById('recover_password').addEventListener('click', function () {
        const email = document.getElementById('recovery_email').value;
        const payload = {
            email
        };

        chrome.runtime.sendMessage({ operation: 'recover_password', payload: payload });
    });
}

function initLoggedInView() {
    document.getElementById('liv_do_logout').addEventListener('click', function () {
        chrome.runtime.sendMessage({ operation: 'logout', payload: {} });
    });
}

function switchToHomeView() {
    document.getElementById('logged_in_view').style.display = 'block';
    document.getElementById('logged_out_view').style.display = 'none';
}

function switchToLoginView() {
    document.getElementById('logged_out_view').style.display = 'block';
    document.getElementById('login_view').style.display = 'block';
    document.getElementById('register_view').style.display = 'none';
    document.getElementById('forgot_password_view').style.display = 'none';
    document.getElementById('logged_in_view').style.display = 'none';
}

function switchToRegisterView() {
    document.getElementById('logged_out_view').style.display = 'block';
    document.getElementById('login_view').style.display = 'none';
    document.getElementById('register_view').style.display = 'block';
    document.getElementById('forgot_password_view').style.display = 'none';
    document.getElementById('logged_in_view').style.display = 'none';
}

function switchToForgotPasswordView() {
    document.getElementById('logged_out_view').style.display = 'block';
    document.getElementById('login_view').style.display = 'none';
    document.getElementById('register_view').style.display = 'none';
    document.getElementById('forgot_password_view').style.display = 'block';
    document.getElementById('logged_in_view').style.display = 'none';
}

function showError(msg) {
    console.log(msg)
    const elem = document.getElementById('error_msg')
    elem.innerHTML = msg
    elem.focus();
}

function init() {
    initLoginView();
    initRegisterView()
    initForgotPasswordView();
    initLoggedInView();
    initErrorMessageField();

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            switch (request.operation) {
                case 'login_success':
                case 'registration_success':
                    switchToHomeView()
                    break;
                case 'password_recovery_success':
                case 'logout_success':
                    switchToLoginView()
                    break;
                case 'login_failure':
                    showError('Unable to log in')
                    break;
                case 'registration_failure':
                    showError('Unable to register')
                    break;
                case 'password_recovery_failure':
                    showError('Unable to recover the password')
                    break;
                case 'logout_failure':
                    showError('Unable to log out')
                    break;
                case 'login_status':
                    console.log('Login status ', request)
                    if (request.payload.status === true)
                        switchToHomeView()
                    else
                        switchToLoginView()
                    break;
                default:
                    console.error('Unknown message', request.operation)
            }
        }
    );

    chrome.runtime.sendMessage({ operation: 'login_status' });
}

document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        init();
    }
}
