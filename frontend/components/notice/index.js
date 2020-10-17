import { useState } from "react";

import styles from "./styles.module.scss";
import CloseIcon from "../../images/close.svg";

const Notice = ({ children, status, mini, dismissible, style }) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div
      style={{ ...style }}
      className={[
        styles.notice,
        isVisible !== true ? styles.notDisplayed : null,
        status === "SUCCESS" ? styles.successNotice : null,
        status === "ERROR" ? styles.errorNotice : null,
        mini ? styles.miniNotice : null,
      ].join(" ")}
    >
      {dismissible && (
        <span
          role="button"
          tabIndex="0"
          className={styles.dismiss}
          onClick={() => setIsVisible(false)}
        >
          <img src={CloseIcon} alt="close icon" />
        </span>
      )}
      {children}
    </div>
  );
};

export default Notice;
