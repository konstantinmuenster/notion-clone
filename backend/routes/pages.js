const express = require("express");

const pagesController = require("../controllers/pages");

const router = express.Router();

// GET /pages
router.get("/", pagesController.getPages);

// GET /pages/{id}
router.get("/:pageId", pagesController.getPage);

// POST /pages
router.post("/", pagesController.postPage);

// PUT /pages/{id}
router.put("/:pageId", pagesController.putPage);

// DELETE /pages/{id}
router.delete("/:pageId", pagesController.deletePage);

module.exports = router;
