import { useState, useEffect } from "react";
import matchSorter from "match-sorter";

import { getCaretCoordinates, getSelectionPositions } from "../../utils";
import styles from "./styles.module.scss";

const MENU_HEIGHT = 150;
const allowedTags = [
  {
    id: "page-title",
    tag: "h1",
    label: "Page Title",
  },
  {
    id: "heading",
    tag: "h2",
    label: "Heading",
  },
  {
    id: "subheading",
    tag: "h3",
    label: "Subheading",
  },
  {
    id: "paragraph",
    tag: "p",
    label: "Paragraph",
  },
];

const TagSelectorMenu = ({ parent, closeMenu, handleSelection }) => {
  const [tagList, setTagList] = useState(allowedTags);
  const [selectedTag, setSelectedTag] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0, aboveBlock: true });
  const [command, setCommand] = useState("");

  useEffect(() => {
    calculateMenuPosition(parent);
  }, [parent]);

  // Filter tagList based on given command
  useEffect(() => {
    setTagList(matchSorter(allowedTags, command, { keys: ["tag"] }));
  }, [command]);

  // Attach listener to allow tag selection via keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSelection(tagList[selectedTag].tag);
      } else if (e.key === "Tab" || e.key === "ArrowDown") {
        e.preventDefault();
        const newSelectedTag =
          selectedTag === tagList.length - 1 ? 0 : selectedTag + 1;
        setSelectedTag(newSelectedTag);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const newSelectedTag =
          selectedTag === 0 ? tagList.length - 1 : selectedTag - 1;
        setSelectedTag(newSelectedTag);
      } else if (e.key === "Backspace") {
        if (command) {
          setCommand(command.slice(0, -1));
        } else {
          closeMenu();
        }
      } else {
        setCommand(command + e.key);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [tagList, selectedTag]);

  const calculateMenuPosition = (ref) => {
    const { selectionEnd } = getSelectionPositions(ref);
    const { x: caretX, y: caretY } = getCaretCoordinates(ref, selectionEnd);

    // If the menu runs out of the top viewport, we place it
    // below the block
    const isMenuOutsideOfTopViewport = caretY - MENU_HEIGHT < 0;
    const modifiedY = !isMenuOutsideOfTopViewport
      ? caretY - MENU_HEIGHT
      : caretY + MENU_HEIGHT / 3;

    setPosition({
      x: caretX,
      y: modifiedY,
      aboveBlock: !isMenuOutsideOfTopViewport,
    });
  };

  return (
    <div
      className={styles.menuWrapper}
      style={{
        top: position.y,
        left: position.x,
        justifyContent: position.aboveBlock ? "flex-end" : "flex-start",
      }}
    >
      <div className={styles.menu}>
        {tagList.map((tag, key) => {
          return (
            <div
              key={key}
              data-tag={tag.tag}
              className={
                tagList.indexOf(tag) === selectedTag
                  ? [styles.item, styles.selectedTag].join(" ")
                  : styles.item
              }
              role="button"
              tabIndex="0"
              onClick={() => handleSelection(tag.tag)}
            >
              {tag.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TagSelectorMenu;
