import ContentEditable from "react-contenteditable";
import { Draggable } from "react-beautiful-dnd";

import styles from "./styles.module.scss";
import TagSelectorMenu from "../tagSelectorMenu";
import ActionMenu from "../actionMenu";
import { setCaretPosition, getSelectionPositions } from "../../utils";
import DragHandleIcon from "../../images/draggable.svg";

// library does not work with hooks
class EditableBlock extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.openActionMenu = this.openActionMenu.bind(this);
    this.closeActionMenu = this.closeActionMenu.bind(this);
    this.openTagSelectorMenu = this.openTagSelectorMenu.bind(this);
    this.closeTagSelectorMenu = this.closeTagSelectorMenu.bind(this);
    this.handleTagSelection = this.handleTagSelection.bind(this);
    this.addPlaceholder = this.addPlaceholder.bind(this);
    this.contentEditable = React.createRef();
    this.state = {
      html: "",
      tag: "p",
      placeholder: false,
      previousKey: null,
      isTyping: false,
      tagSelectorMenuOpen: false,
      actionMenuOpen: false,
      blockHovering: false,
    };
  }

  // To avoid unnecessary API calls, the block component fully owns the draft state
  // i.e. while editing we only update the block component, only when the user
  // finished editing (e.g. switched to next block), we update the page as well
  // https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html

  componentDidMount() {
    const isPlaceholderAdded = this.addPlaceholder(
      this.props.position,
      this.props.html,
      this.contentEditable.current
    );
    if (!isPlaceholderAdded) {
      this.setState({
        ...this.state,
        html: this.props.html,
        tag: this.props.tag,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // if the user stopped editing and we have some content, we compare it to
    // the content we received via props. If it has changed, we update the page
    if (prevState.isTyping && !this.state.isTyping && !this.state.placeholder) {
      const htmlChanged = this.props.html !== this.state.html;
      const tagChanged = this.props.tag !== this.state.tag;
      if (htmlChanged || tagChanged) {
        this.props.updateBlock({
          id: this.props.id,
          html: this.state.html,
          tag: this.state.tag,
        });
      }
    }
  }

  componentWillUnmount() {
    // In case, the user deleted the block, we need to cleanup all listeners
    document.removeEventListener("click", this.closeActionMenu, false);
  }

  handleChange(e) {
    this.setState({ ...this.state, html: e.target.value });
  }

  handleFocus(e) {
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
  }

  handleBlur(e) {
    // Show placeholder if block is still the only one and empty
    const isPlaceholderAdded = this.addPlaceholder(
      this.props.position,
      this.state.html,
      this.contentEditable.current
    );
    if (!isPlaceholderAdded) {
      this.setState({ ...this.state, isTyping: false });
    }
  }

  handleKeyDown(e) {
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
      this.props.addBlock({
        id: this.props.id,
        html: this.state.html,
        tag: this.state.tag,
        ref: this.contentEditable.current,
      });
    }
    // We need the previousKey to detect a Shift-Enter-combination
    this.setState({ previousKey: e.key });
  }

  handleMouseUp() {
    const blockEl = this.contentEditable.current;
    const { selectionStart, selectionEnd } = getSelectionPositions(blockEl);
    if (selectionStart !== selectionEnd) {
      this.openActionMenu();
    }
  }

  handleMouseEnter() {
    this.setState({ ...this.state, blockHovering: true });
  }

  handleMouseLeave() {
    this.setState({ ...this.state, blockHovering: false });
  }

  openActionMenu() {
    this.setState({ ...this.state, actionMenuOpen: true });
    // Add listener asynchronously to avoid conflicts with
    // the double click of the text selection
    setTimeout(() => {
      document.addEventListener("click", this.closeActionMenu, false);
    }, 100);
  }

  closeActionMenu() {
    this.setState({ ...this.state, actionMenuOpen: false });
    document.removeEventListener("click", this.closeActionMenu, false);
  }

  openTagSelectorMenu() {
    this.setState({ ...this.state, tagSelectorMenuOpen: true });
    document.addEventListener("click", this.closeTagSelectorMenu, false);
  }

  closeTagSelectorMenu() {
    this.setState({ ...this.state, tagSelectorMenuOpen: false });
    document.removeEventListener("click", this.closeTagSelectorMenu, false);
  }

  handleTagSelection(tag) {
    if (this.state.isTyping) {
      // Identifying the command position is a bit harder since an html tag
      // like </h2> is also a valid syntax for a command. Therefore, we have
      // to look for anything like /h2 which is not an html tag
      // Not perfect... anyways
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
  }

  // Show a placeholder for blank pages
  addPlaceholder(pos, html, ref) {
    const isFirstBlockWithoutHtml = pos === 1 && !html;
    const isFirstBlockWithoutSibling = !ref.parentElement.nextElementSibling;
    if (isFirstBlockWithoutHtml && isFirstBlockWithoutSibling) {
      this.setState({
        ...this.state,
        html: "Type a page title...",
        tag: "h1",
        placeholder: true,
        isTyping: false,
      });
      return true;
    } else {
      return false;
    }
  }

  render() {
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
              deleteBlock: () => this.props.deleteBlock({ id: this.props.id }),
              turnInto: this.openTagSelectorMenu,
            }}
          />
        )}
        <Draggable draggableId={this.props.id} index={this.props.position}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              className={styles.draggable}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
              {...provided.draggableProps}
            >
              <ContentEditable
                innerRef={this.contentEditable}
                data-position={this.props.position}
                html={this.state.html}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onKeyDown={this.handleKeyDown}
                tagName={this.state.tag}
                className={[
                  styles.block,
                  this.state.blockHovering ? styles.blockHovering : null,
                  this.state.placeholder ? styles.placeholder : null,
                  snapshot.isDragging ? styles.isDragging : null,
                ].join(" ")}
              />
              <span
                role="button"
                tabIndex="0"
                className={styles.dragHandle}
                style={
                  this.state.blockHovering ? { opacity: 1 } : { opacity: 0 }
                }
                {...provided.dragHandleProps}
              >
                <img src={DragHandleIcon} alt="Icon" />
              </span>
            </div>
          )}
        </Draggable>
      </>
    );
  }
}

export default EditableBlock;
