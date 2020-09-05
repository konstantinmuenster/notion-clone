const getSelectionPositions = (el) => {
  const range = window.getSelection().getRangeAt(0);
  const preSelectionRange = range.cloneRange();
  preSelectionRange.selectNodeContents(el);
  preSelectionRange.setEnd(range.startContainer, range.startOffset);
  const start = preSelectionRange.toString().length;
  return {
    selectionStart: start,
    selectionEnd: start + range.toString().length,
  };
};

export default getSelectionPositions;
