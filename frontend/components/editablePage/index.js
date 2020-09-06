import { useState, useEffect } from "react";

import EditableBlock from "../editableBlock";

// A page is represented by an array containing several blocks
// [
//   {
//     _id: "5f54d75b114c6d176d7e9765",
//     html: "Heading",
//     tag: "h1",
//   },
//   {
//     _id: "5f54d75b114c6d176d7e9766",
//     html: "I am a <strong>paragraph</strong>",
//     tag: "p",
//   }
// ]

const EditablePage = ({ id, fetchedBlocks, err }) => {
  if (err) return <h1>Something went wrong.</h1>;

  const [blocks, setBlocks] = useState(fetchedBlocks);
  const [selectedBlock, setSelectedBlock] = useState(null);

  // Update the database whenever blocks change
  useEffect(() => {
    const updatePageOnServer = async (blocks) => {
      try {
        const response = await fetch(`${process.env.API}/pages/${id}`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            blocks: blocks,
          }),
        });
        await response.json();
      } catch (err) {
        console.log(err);
      }
    };
    if (blocks !== fetchedBlocks) {
      updatePageOnServer(blocks);
    }
  }, [blocks, fetchedBlocks]);

  // When a new block was added, move the caret to it
  useEffect(() => {
    if (selectedBlock && selectedBlock.nextElementSibling) {
      selectedBlock.nextElementSibling.focus();
    }
  }, [selectedBlock]);

  const updateBlockHandler = (currentBlock) => {
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    const newBlocks = [...blocks];
    newBlocks[index] = {
      tag: currentBlock.tag,
      html: currentBlock.html,
    };
    setBlocks(newBlocks);
  };

  const addBlockHandler = (currentBlock) => {
    setSelectedBlock(currentBlock.ref);
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, { tag: "p", html: "" });
    setBlocks(newBlocks);
  };

  const deleteBlockHandler = (currentBlock) => {
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    const newBlocks = [...blocks];
    newBlocks.splice(index, 1);
    setBlocks(newBlocks);
  };

  const page = blocks.map((block, key) => {
    const position = blocks.map((b) => b._id).indexOf(block._id) + 1;
    return (
      <EditableBlock
        key={block._id || key}
        position={position}
        id={block._id}
        tag={block.tag}
        html={block.html}
        addBlock={addBlockHandler}
        deleteBlock={deleteBlockHandler}
        updateBlock={updateBlockHandler}
      />
    );
  });

  return page;
};

export default EditablePage;
