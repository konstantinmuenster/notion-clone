import styles from "./styles.module.scss";

const Notice = ({ children, status, mini, style }) => {
  return (
    <div
      style={{ ...style }}
      className={[
        styles.notice,
        status === "SUCCESS" ? styles.successNotice : null,
        status === "ERROR" ? styles.errorNotice : null,
        mini ? styles.miniNotice : null,
      ].join(" ")}
    >
      {children}
    </div>
  );
};

export default Notice;
