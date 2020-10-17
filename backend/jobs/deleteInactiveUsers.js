const User = require("../models/user");

// In the sign up process, users get an email to activate their
// account. If they do not activate it within 48 hours, this job
// removes any inactive user from the database.

const TWO_DAYS = 1000 * 60 * 60 * 24 * 2;

const deleteInactiveUsers = async () => {
  console.log(`Starting job: ${deleteInactiveUsers.name}`);
  try {
    const response = await User.deleteMany({
      active: false,
      createdAt: { $lt: new Date(Date.now() - TWO_DAYS).toISOString() },
    });
    console.log(`SUCCESS - Deleted ${response.deletedCount} users.`);
  } catch (err) {
    console.log(`ERROR - ${err.message}`);
  }
};

module.exports = deleteInactiveUsers;
