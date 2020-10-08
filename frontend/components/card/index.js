import { useState } from "react";
import { useRouter } from "next/router";

import DOMPurify from "isomorphic-dompurify";

import ContextMenu from "../contextMenu";
import styles from "./styles.module.scss";
import MoreIcon from "../../images/more.svg";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Card = ({ pageId, date, content, deleteCard }) => {
  const router = useRouter();
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  // In the card preview, we only want to show textual content
  const textContent = content.filter((block) => block.tag !== "img");

  const formattedDate = `${
    MONTHS[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}`;

  // https://github.com/vercel/next.js/issues/2833#issuecomment-489292656
  const forwardToPage = (id) => {
    router.push("/p/[pid]", `/p/${id}`);
  };

  const deletePage = (id) => {
    setIsContextMenuOpen(false);
    deleteCard(id); // Self-destroy mode
  };

  const toggleContextMenu = () => {
    setIsContextMenuOpen(!isContextMenuOpen);
  };

  const closeContextMenu = () => {
    setIsContextMenuOpen(false);
  };

  return (
    <div className={styles.cardWrapper}>
      <a href={`/p/${pageId}`}>
        <article className={styles.card}>
          <div className={styles.date}>{formattedDate}</div>
          <div className={styles.content}>
            {textContent.map((block, key) => {
              const HTMLTag = block.tag;
              const html = DOMPurify.sanitize(block.html);
              return (
                <HTMLTag key={key} dangerouslySetInnerHTML={{ __html: html }} />
              );
            })}
          </div>
        </article>
      </a>
      <span
        role="button"
        tabIndex="0"
        className={styles.moreButton}
        onClick={() => toggleContextMenu()}
      >
        <img src={MoreIcon} alt="Icon" />
      </span>
      {isContextMenuOpen && (
        <ContextMenu
          menuItems={[
            { id: "edit", label: "Edit", action: () => forwardToPage(pageId) },
            { id: "delete", label: "Delete", action: () => deletePage(pageId) },
          ]}
          closeAction={() => closeContextMenu()}
        />
      )}
    </div>
  );
};

export default Card;
