const mongoose = require("mongoose");

const deleteInactiveUsers = require("./deleteInactiveUsers");
const deletePublicPages = require("./deletePublicPages");

const executeJobs = async () => {
  console.log("Setup database connection");
  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@notion-clone-0.gqqwp.gcp.mongodb.net/notion?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(async () => {
      console.log("SUCCESS - Database connected.");

      // Running jobs
      await deleteInactiveUsers();
      await deletePublicPages();

      process.exit();
    })
    .catch((err) => {
      console.log(`ERROR - While connected to database: ${err.message}`);
    });
};

executeJobs();
