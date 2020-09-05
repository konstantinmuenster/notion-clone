import ContentEditable from "react-contenteditable";

import styles from "./styles.module.scss";
import TagSelectorMenu from "../tagSelectorMenu";
import ActionMenu from "../actionMenu";
import { setCaretPosition, getSelectionPositions } from "../../utils";

// library does not work with hooks
class EditableBlock extends React.Component {
  state = {
    html: "",
    tag: "p",
    disabled: false,
    placeholder: false,
    previousKey: null,
    isTyping: false,
    tagSelectorMenuOpen: false,
    actionMenuOpen: false,
  };

  constructor(props) {
    super(props);
    this.contentEditable = React.createRef();
  }

  componentDidMount = () => {
    // Show a placeholder for blank pages
    if (this.props.position === 1 && !this.state.html) {
      this.setState({
        ...this.state,
        html: "Type a page title...",
        tag: "h1",
        placeholder: true,
      });
    }
  };

  handleChange = (e) => {
    this.setState({ ...this.state, html: e.target.value });
  };

  handleFocus = (e) => {
    if (this.state.placeholder) {
      this.setState({
        ...this.state,
        html: "",
        placeholder: false,
        isTyping: true,
      });
    } else {
      this.setState({ ...this.state, isTyping: true });
    }
  };

  handleBlur = (e) => {
    // Show placeholder if block is still the only one and empty
    if (
      this.props.position === 1 &&
      !this.state.html &&
      !e.target.nextElementSibling
    ) {
      this.setState({
        ...this.state,
        html: "Type something...",
        placeholder: true,
        isTyping: false,
      });
    } else {
      this.setState({ ...this.state, isTyping: false });
    }
  };

  handleKeyDown = (e) => {
    if (e.key === "/") {
      this.openTagSelectorMenu();
    } else if (
      e.key === "Enter" &&
      this.state.previousKey !== "Shift" &&
      !this.state.tagSelectorMenuOpen
    ) {
      // If the user presses Enter, we want to add a new block
      // Only the Shift-Enter-combination should add a new paragraph
      // as the default Enter behaviour
      e.preventDefault();
      this.props.addNewBlock(e);
    }
    // We need the previousKey to detect a Shift-Enter-combination
    this.setState({ previousKey: e.key });
  };

  handleMouseUp = (e) => {
    const blockEl = this.contentEditable.current;
    const { selectionStart, selectionEnd } = getSelectionPositions(blockEl);
    if (selectionStart !== selectionEnd) {
      this.openActionMenu();
    }
  };

  openActionMenu = () => {
    this.setState({ ...this.state, actionMenuOpen: true });
    // Add listener asynchronously to avoid conflicts with
    // the double click of the text selection
    setTimeout(() => {
      document.addEventListener("click", this.closeActionMenu, false);
    }, 100);
  };

  closeActionMenu = () => {
    this.setState({ ...this.state, actionMenuOpen: false });
    document.removeEventListener("click", this.closeActionMenu, false);
  };

  openTagSelectorMenu = () => {
    this.setState({ ...this.state, tagSelectorMenuOpen: true });
    document.addEventListener("click", this.closeTagSelectorMenu, false);
  };

  closeTagSelectorMenu = () => {
    this.setState({ ...this.state, tagSelectorMenuOpen: false });
    document.removeEventListener("click", this.closeTagSelectorMenu, false);
  };

  handleTagSelection = (tag) => {
    if (this.state.isTyping) {
      // Identifying the command position is a bit harder since an html tag
      // like </h2> is also a valid syntax for a command. Therefore, we have
      // to look for anything like /h2 which is not an html tag
      const slashPosition = /(?![^<]*>)\/+[a-z0-9]*/gm.exec(this.state.html);
      const htmlWithoutCmd = this.state.html.substring(0, slashPosition.index);
      this.setState(
        {
          ...this.state,
          tag: tag,
          html: htmlWithoutCmd,
        },
        () => {
          const blockEl = this.contentEditable.current;
          setCaretPosition(blockEl);
          blockEl.focus();
          this.closeTagSelectorMenu();
        }
      );
    } else {
      this.setState({ ...this.state, tag: tag }, () => {
        this.closeTagSelectorMenu();
      });
    }
  };

  render = () => {
    return (
      <>
        {this.state.tagSelectorMenuOpen && (
          <TagSelectorMenu
            parent={this.contentEditable.current}
            closeMenu={this.closeTagSelectorMenu}
            handleSelection={this.handleTagSelection}
          />
        )}
        {this.state.actionMenuOpen && (
          <ActionMenu
            parent={this.contentEditable.current}
            actions={{
              deleteBlock: () => this.props.deleteBlock(this.props.id),
              turnInto: this.openTagSelectorMenu,
            }}
          />
        )}
        <ContentEditable
          innerRef={this.contentEditable}
          data-id={this.props.id}
          html={this.state.html}
          disabled={this.state.disabled}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
          onMouseUp={this.handleMouseUp}
          tagName={this.state.tag}
          className={styles.block}
          style={
            this.state.placeholder ? { color: "rgba(72,72,72,.25)" } : null
          }
        />
      </>
    );
  };
}

export default EditableBlock;
