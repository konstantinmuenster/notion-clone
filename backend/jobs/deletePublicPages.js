const Page = require("../models/page");

// A public page is a page that was created by a guest user. To avoid
// massive database storage usage, we delete them after 24 hours.

const ONE_DAY = 1000 * 60 * 60 * 24;

const deletePublicPages = async () => {
  console.log(`Starting job: ${deletePublicPages.name}`);
  try {
    const response = await Page.deleteMany({
      creator: null,
      createdAt: { $lt: new Date(Date.now() - ONE_DAY).toISOString() },
    });
    console.log(`SUCCESS - Deleted ${response.deletedCount} pages.`);
  } catch (err) {
    console.log(`ERROR - ${err.message}`);
  }
};

module.exports = deletePublicPages;
