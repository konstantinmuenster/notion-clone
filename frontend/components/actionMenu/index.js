import { useState, useEffect } from "react";

import styles from "./styles.module.scss";
import TrashIcon from "../../images/trash.svg";
import { getCaretCoordinates, getSelectionPositions } from "../../utils";

const MENU_WIDTH = 150;
const MENU_HEIGHT = 40;

const ActionMenu = ({ parent, actions }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // When the components mounts, calculate the menu position
  useEffect(() => {
    calculateMenuPosition(parent);
  }, []);

  const calculateMenuPosition = (ref) => {
    const { selectionStart, selectionEnd } = getSelectionPositions(ref);
    const { x: startX, y: startY } = getCaretCoordinates(ref, selectionStart);
    const { x: endX, y: endY } = getCaretCoordinates(ref, selectionEnd);
    const middleX = startX + (endX - startX) / 2;
    setPosition({ x: middleX - MENU_WIDTH / 2, y: startY - MENU_HEIGHT - 10 });
  };

  const handleClick = (action) => {
      switch(action) {
          case "DELETE": actions.deleteBlock(); break;
      }
  }

  return (
    <div
      className={styles.menuWrapper}
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      <div className={styles.menu}>
        <span
          id="turn-into"
          className={styles.menuItem}
          role="button"
          tabIndex="0"
          onClick={() => actions.turnInto()}
        >
          Turn into
        </span>
        <span
          id="delete"
          className={styles.menuItem}
          role="button"
          tabIndex="0"
          onClick={() => handleClick("DELETE")}
        >
          <img src={TrashIcon} alt="Trash Icon" />
        </span>
      </div>
    </div>
  );
};

export default ActionMenu;
