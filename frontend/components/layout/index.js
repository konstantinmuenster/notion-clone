import Button from "../button";
import styles from "./styles.module.scss";
import GithubIcon from "../../images/github.svg";

const Layout = ({ children }) => {
  return (
    <div id="layoutRoot">
      <header className={styles.headerBar}>
        <div className={styles.logo}>
          <a href="/" role="link" tabIndex="0">
            notion<span style={{ fontSize: "1.25rem" }}>.clone</span>
          </a>
        </div>
        <nav className={styles.nav}>
          <Button href="/login">Login</Button>
        </nav>
      </header>
      <main className={styles.content}>{children}</main>
      <footer className={styles.footerBar}>
        <hr className={styles.hr} />
        <div className={styles.github}>
          <a href="/" rel="noopener noreferrer" role="link" tabIndex="0">
            <img src={GithubIcon} alt="Github Icon" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
