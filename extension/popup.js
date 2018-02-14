document.getElementById('login').addEventListener('click', function () {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const payload = {
        username,
        password
    };

    chrome.runtime.sendMessage({ operation: 'login', payload: payload }, function (response) {
        console.log(response);
    });
});