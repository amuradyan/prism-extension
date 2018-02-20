const shajs = require('sha.js');
const prismURL = 'https://prism.melbourne/';


document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        init();
    }
}

function init() {
    initLoginView();
    initRegisterView()
    initForgotPasswordView();
    initLoggedInView();

    chrome.cookies.get({ url: prismURL, name: 'credentials' }, function (cookie) {
        if (cookie) {
            const credentials = JSON.parse(cookie.value);
            console.log('Prism credentials coocie found ', credentials);
            login(credentials.username, credentials.password);
        } else {
            console.log('no cookies found for prism');
        }
    });
}

function initLoginView() {
    document.getElementById('lv_do_register').addEventListener('click', function () {
        document.getElementById('register_view').style.display = 'block';
        document.getElementById('login_view').style.display = 'none';
        document.getElementById('forgot_password_view').style.display = 'none';
        document.getElementById('forgot_password_view').style.display = 'none';
    });

    document.getElementById('lv_do_forgot_password').addEventListener('click', function () {
        document.getElementById('forgot_password_view').style.display = 'block';
        document.getElementById('register_view').style.display = 'none';
        document.getElementById('login_view').style.display = 'none';
    });

    document.getElementById('login').addEventListener('click', function () {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (document.getElementById('remember_me').checked) {
            const cookie = {
                url: prismURL,
                name: 'credentials',
                value: JSON.stringify({
                    username: username,
                    password: password
                }),
            };

            chrome.cookies.set(cookie, function (c) {
                if (c) {
                    console.log('Cookie stored for user' + username);
                } else {
                    console.log('Unable to store cookie for user' + username);
                }
            });
        }

        login(username, password);
    });
}

function initRegisterView() {
    document.getElementById('rv_do_login').addEventListener('click', function () {
        document.getElementById('login_view').style.display = 'block';
        document.getElementById('register_view').style.display = 'none';
        document.getElementById('forgot_password_view').style.display = 'none';
    });

    document.getElementById('rv_do_forgot_password').addEventListener('click', function () {
        document.getElementById('forgot_password_view').style.display = 'block';
        document.getElementById('register_view').style.display = 'none';
        document.getElementById('login_view').style.display = 'none';
    });

    document.getElementById('register').addEventListener('click', function () {
        const name = document.getElementById('name').value;
        const surname = document.getElementById('surname').value;
        const email = document.getElementById('reg_email').value;
        const handle = document.getElementById('handle').value;
        const regPassword = document.getElementById('reg_password').value;
        const regPasswordHash = new shajs('sha512').update(regPassword).digest('hex');

        const payload = {
            name,
            surname,
            email,
            handle,
            regPasswordHash
        };

        chrome.runtime.sendMessage({ operation: 'register', payload: payload }, function (response) {
            console.log(response);
        });
    });
}

function initForgotPasswordView() {
    document.getElementById('fpv_do_login').addEventListener('click', function () {
        document.getElementById('login_view').style.display = 'block';
        document.getElementById('register_view').style.display = 'none';
        document.getElementById('forgot_password_view').style.display = 'none';
    });

    document.getElementById('fpv_do_register').addEventListener('click', function () {
        document.getElementById('register_view').style.display = 'block';
        document.getElementById('forgot_password_view').style.display = 'none';
        document.getElementById('login_view').style.display = 'none';
    });

    document.getElementById('req_password').addEventListener('click', function () {
        const email = document.getElementById('forgot_email').value;
        const payload = {
            email
        };

        chrome.runtime.sendMessage({ operation: 'forgotPassword', payload: payload }, function (response) {
            console.log(response);
        });
    });
}

function initLoggedInView() {
    document.getElementById('liv_do_logout').addEventListener('click', function () {
        document.getElementById('logged_in_view').style.display = 'none';
        document.getElementById('logged_out_view').style.display = 'block';    
        chrome.cookies.remove({ url: prismURL, name: 'credentials' }, function () {
            console.log('Removed prism credentials from cookies');
        })
    });
}

function login(username, password) {
    console.log('Logging in with ', username, password);
    const pwdHash = new shajs('sha512').update(password).digest('hex');

    const payload = {
        handle: username,
        passwordHash: pwdHash
    };

    console.log(payload);

    chrome.runtime.sendMessage({ operation: 'login', payload: payload });
}

function switchToLoggedInView(){
    document.getElementById('logged_in_view').style.display = 'block';
    document.getElementById('logged_out_view').style.display = 'none';
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.operation === 'login_success') {
            saveFacet(request.payload, sender.tab.url);
        } else if (request.operation === 'login_failure') {
            login(request.payload);
        }
    });
