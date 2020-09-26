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

// POST /pages/images
router.post("/images", pagesController.postImage);

// DELETE /pages/images/{name}
router.delete("/images/:imageName", pagesController.deleteImage);

module.exports = router;
