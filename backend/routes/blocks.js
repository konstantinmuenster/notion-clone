const express = require("express");

const blocksController = require("../controllers/blocks");

const router = express.Router();

// GET /blocks/{id}
router.get("/:blockId", blocksController.getBlock);

// POST /blocks
router.post("/", blocksController.postBlock);

// PUT /blocks/{id}
router.put("/:blockId", blocksController.putBlock);

// DELETE /blocks/{id}
router.delete("/:blockId", blocksController.deleteBlock);

module.exports = router;
