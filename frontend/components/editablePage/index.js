import { useState, useEffect } from "react";
import uid from "uid";

import EditableBlock from "../editableBlock";

const EditablePage = () => {
  const initialBlockId = uid();
  const initialBlocks = [initialBlockId];
  const [blocks, setBlocks] = useState(initialBlocks);
  const [blockRef, setBlockRef] = useState(null);

  useEffect(() => {
    // When a new block was added, move the caret to it
    if (blocks !== initialBlocks && blockRef.nextElementSibling) {
      blockRef.nextElementSibling.focus();
    }
  }, [blocks, blockRef]);

  const addNewBlockHandler = (e) => {
    setBlockRef(e.target); // We need the ref to focus the new block in useEffect
    const blockId = e.target.attributes["data-id"].value;
    const blockPos = blocks.indexOf(blockId);
    const newBlockId = uid();
    const newBlocks = [...blocks];
    newBlocks.splice(blockPos + 1, 0, newBlockId);
    setBlocks(newBlocks);
  };

  const deleteBlockHandler = (id) => {
    const newBlocks = [...blocks].splice(blocks.indexOf(id), 1);
    setBlocks(newBlocks);
  };

  const page = blocks.map((block, key) => {
    return (
      <EditableBlock
        key={key}
        id={block}
        position={blocks.indexOf(block) + 1}
        addNewBlock={addNewBlockHandler}
        deleteBlock={deleteBlockHandler}
      />
    );
  });

  return page;
};

export default EditablePage;
