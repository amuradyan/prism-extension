// function Patch() {
//   var 
//   return {
//     sourcePath:''
//   }
// }

module.exports = getSelectedText;

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

  chrome.extension.sendRequest({'selection': selectedText});
  return selectedText;
}
 