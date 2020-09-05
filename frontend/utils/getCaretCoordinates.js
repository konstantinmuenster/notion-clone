// https://gist.github.com/jh3y/6c066cea00216e3ac860d905733e65c7#file-getcursorxy-js

const getCaretCoordinates = (el, pos) => {
  const { offsetLeft, offsetTop } = el;

  // Create replica div containing the text up to the caret index
  const textContent = el.textContent.substring(0, pos);
  const div = createClonedDiv(el, textContent);

  // Create a span and append it to the div...
  const span = document.createElement("span");
  span.textContent = ".";
  div.append(span);
  document.body.appendChild(div);

  // ... so that we can use it to determine the absolute px
  // coordinates - the position of the span is the same as
  // the caret position
  const { offsetLeft: spanX, offsetTop: spanY } = span;
  document.body.removeChild(div);

  return {
    x: offsetLeft + spanX,
    y: offsetTop + spanY,
  };
};

const createClonedDiv = (div, content) => {
  const clonedDiv = document.createElement("div");
  const copyStyle = getComputedStyle(div);
  for (const prop of copyStyle) {
    clonedDiv.style[prop] = copyStyle[prop];
  }
  clonedDiv.textContent = content;
  clonedDiv.style.height = "auto";
  clonedDiv.style.position = "fixed";
  clonedDiv.style.top = "0px";
  clonedDiv.style.left = "0px";
  clonedDiv.style.opacity = 0;
  return clonedDiv;
};

export default getCaretCoordinates;
