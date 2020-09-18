import { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import EditableBlock from "../editableBlock";
import { usePrevious } from "../../hooks";
import { objectId } from "../../utils";

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
  const [currentBlockRef, setCurrentBlockRef] = useState(null);

  const prevBlocks = usePrevious(blocks);

  // Update the database whenever blocks change
  useEffect(() => {
    const updatePageOnServer = async (blocks) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/pages/${id}`,
          {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              blocks: blocks,
            }),
          }
        );
        await response.json();
      } catch (err) {
        console.log(err);
      }
    };
    if (prevBlocks && prevBlocks !== blocks) {
      updatePageOnServer(blocks);
    }
  }, [blocks, prevBlocks]);

  // Focus new block if it was added
  useEffect(() => {
    if (prevBlocks && prevBlocks.length + 1 === blocks.length) {
      const nextBlock =
        currentBlockRef.parentElement.nextElementSibling.firstElementChild;
      if (nextBlock.isContentEditable) {
        nextBlock.focus();
      }
    }
  }, [currentBlockRef]);

  const updateBlockHandler = (currentBlock) => {
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: currentBlock.tag,
      html: currentBlock.html,
    };
    setBlocks(updatedBlocks);
  };

  const addBlockHandler = (currentBlock) => {
    setCurrentBlockRef(currentBlock.ref);
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    const newBlock = { _id: objectId(), tag: "p", html: "" };
    updatedBlocks.splice(index + 1, 0, newBlock);
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: currentBlock.tag,
      html: currentBlock.html,
    };
    setBlocks(updatedBlocks);
  };

  const deleteBlockHandler = (currentBlock) => {
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index, 1);
    setBlocks(updatedBlocks);
  };

  const onDragEndHandler = (result) => {
    const { destination, source } = result;

    // If we don't have a destination (due to dropping outside the droppable)
    // or the destination hasn't changed, we change nothing
    if (!destination || destination.index === source.index) {
      return;
    }

    const updatedBlocks = [...blocks];
    const removedBlocks = updatedBlocks.splice(source.index - 1, 1);
    updatedBlocks.splice(destination.index - 1, 0, removedBlocks[0]);
    setBlocks(updatedBlocks);
  };

  return (
    <DragDropContext onDragEnd={onDragEndHandler}>
      <Droppable droppableId={id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {blocks.map((block) => {
              const position = blocks.map((b) => b._id).indexOf(block._id) + 1;
              return (
                <EditableBlock
                  key={block._id}
                  position={position}
                  id={block._id}
                  tag={block.tag}
                  html={block.html}
                  addBlock={addBlockHandler}
                  deleteBlock={deleteBlockHandler}
                  updateBlock={updateBlockHandler}
                />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default EditablePage;
