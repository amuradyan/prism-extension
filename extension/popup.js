const sha512 = require('sha.js')('sha512');

document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        init();
    }
}

function init() {
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