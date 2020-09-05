// https://stackoverflow.com/questions/40632975/set-caret-position-in-a-content-editable-element/40633263

const setCaretPosition = (el) => {
  const range = document.createRange();
  const selection = window.getSelection();
  if (el.lastElementChild) {
    range.setStart(el.lastElementChild, 0);
  } else {
    range.setStart(el.childNodes[0], el.innerText.length);
  }
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
};

export default setCaretPosition;
