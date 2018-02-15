const sha512 = require('sha.js')('sha512');

document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        init();
    }
}

function init() {
    initLoginView();
    initRegisterView()
    initForgotPasswordView();
}

function initLoginView() {
    document.getElementById('lv_do_register').addEventListener('click', function () {
        document.getElementById('register_view').style.display = 'block';
        document.getElementById('login_view').style.display = 'none';
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
        const passwordHash = sha512.update(password).digest('hex');

        const payload = {
            username,
            passwordHash
        };

        chrome.runtime.sendMessage({ operation: 'login', payload: payload }, function (response) {
            console.log(response);
        });
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
        const regPasswordHash = sha512.update(regPassword).digest('hex');

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