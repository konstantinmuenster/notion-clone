const getSelection = (element) => {
  let selectionStart, selectionEnd;
  const isSupported = typeof window.getSelection !== "undefined";
  if (isSupported) {
    const range = window.getSelection().getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(element);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    selectionStart = preSelectionRange.toString().length;
    selectionEnd = selectionStart + range.toString().length;
  }
  return { selectionStart, selectionEnd };
};

export default getSelection;
