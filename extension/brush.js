function initContentScript() {
	// body...
}

function getSelectedText() {
  var focused = document.activeElement;
  var selectedText;
  if (focused) {
    try {
      selectedText = focused.value.substring(
          focused.selectionStart, focused.selectionEnd);
    } catch (err) {
    }
  }
  if (selectedText == undefined) {
    var sel = window.getSelection();
    var selectedText = sel.toString();
  }

  console.log("Yo" + selectedText)
  chrome.extension.sendRequest({'selection': selectedText});
}

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        alert("Got it!");
        if(request.type == "patch"){
			alert("Patching" + getSelectedText());
        } else if(request.type == "note"){
			alert("Noting" + getSelectedText());
        }
});

initContentScript()