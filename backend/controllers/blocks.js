const Block = require("../models/block");

const getBlock = (req, res, next) => {
  const blockId = req.params.blockId;
  Block.findById(blockId)
    .then((block) => {
      if (block) {
        res.status(200).json({
          message: "Fetched block successfully.",
          block: block,
        });
      } else {
        const err = new Error("Could not find block by id.");
        err.statusCode = 404;
        throw err;
      }
    })
    .catch((err) => {
      next(err);
    });
};

const postBlock = (req, res, next) => {
  const tag = req.body.tag;
  const html = req.body.html;
  const disabled = req.body.disabled;
  const block = new Block({
    tag: tag,
    html: html,
    disabled: disabled,
  });
  block
    .save()
    .then((block) => {
      res.status(201).json({
        message: "Created block successfully.",
        blockId: block._id,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const putBlock = (req, res, next) => {
  const blockId = req.params.blockId;
  const tag = req.body.tag;
  const html = req.body.html;
  const disabled = req.body.disabled;
  Block.findById(blockId)
    .then((block) => {
      if (block) {
        block.tag = tag;
        block.html = html;
        block.disabled = disabled;
        return block.save();
      } else {
        const err = new Error("Could not find block by id.");
        err.statusCode = 404;
        throw err;
      }
    })
    .then((block) => {
      res.status(200).json({
        message: "Updated block successfully.",
        block: block,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteBlock = (req, res, next) => {
  const blockId = req.params.blockId;
  Block.findById(blockId)
    .then((block) => {
      if (block) {
        return Block.deleteOne({ _id: blockId });
      } else {
        const err = new Error("Could not find block by id.");
        err.statusCode = 404;
        throw err;
      }
    })
    .then((result) => {
      res.status(200).json({
        message: "Deleted block successfully.",
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getBlock = getBlock;
exports.postBlock = postBlock;
exports.putBlock = putBlock;
exports.deleteBlock = deleteBlock;
