const Page = require("../models/page");

const getPages = (req, res, next) => {
  Page.find()
    .then((pages) => {
      res.status(200).json({
        message: "Fetched pages successfully.",
        pages: pages.map((page) => page._id),
      });
    })
    .catch((err) => {
      next(err);
    });
};

const getPage = (req, res, next) => {
  const pageId = req.params.pageId;
  Page.findById(pageId)
    .then((page) => {
      if (page) {
        res.status(200).json({
          message: "Fetched page successfully.",
          page: page,
        });
      } else {
        const err = new Error("Could not find page by id.");
        err.statusCode = 404;
        throw err;
      }
    })
    .catch((err) => {
      next(err);
    });
};

const postPage = (req, res, next) => {
  const blocks = req.body.blocks;
  const page = new Page({
    blocks: blocks,
  });
  page
    .save()
    .then((page) => {
      res.status(201).json({
        message: "Created page successfully.",
        pageId: page._id,
        blocks: blocks,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const putPage = (req, res, next) => {
  const pageId = req.params.pageId;
  const blocks = req.body.blocks;
  Page.findById(pageId)
    .then((page) => {
      if (page) {
        page.blocks = blocks;
        return page.save();
      } else {
        const err = new Error("Could not find page by id.");
        err.statusCode = 404;
        throw err;
      }
    })
    .then((page) => {
      res.status(200).json({
        message: "Updated page successfully.",
        page: page,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const deletePage = (req, res, next) => {
  const pageId = req.params.pageId;
  Page.findById(pageId)
    .then((page) => {
      if (page) {
        return Page.deleteOne({ _id: pageId });
      } else {
        const err = new Error("Could not find page by id.");
        err.statusCode = 404;
        throw err;
      }
    })
    .then((result) => {
      res.status(200).json({
        message: "Deleted page successfully.",
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getPages = getPages;
exports.getPage = getPage;
exports.postPage = postPage;
exports.putPage = putPage;
exports.deletePage = deletePage;
