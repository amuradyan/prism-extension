module.exports = getSelectedText;

function getSelectedText() {

  var focused = document.activeElement;
  var sel = window.getSelection()
  var range = sel.getRangeAt(0)
  var startCon = range.startContainer
  var endCon = range.endContainer

  return sel.toString();
}