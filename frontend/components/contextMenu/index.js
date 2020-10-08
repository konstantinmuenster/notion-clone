import { useRef } from "react";

import styles from "./styles.module.scss";
import { useOnClickOutside } from "../../hooks";

const contextMenu = ({ menuItems, closeAction }) => {
  const ref = useRef();

  // Close the menu if there are any clicks outside the menu
  useOnClickOutside(ref, closeAction);

  return (
    <div ref={ref} className={styles.menuWrapper}>
      <div className={styles.menu}>
        {menuItems.map((item, key) => {
          return (
            <div
              key={key}
              className={styles.item}
              role="button"
              tabIndex="0"
              onClick={item.action}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default contextMenu;
