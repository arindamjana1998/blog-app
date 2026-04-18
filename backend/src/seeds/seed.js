const User = require("../models/User");

const seedData = async () => {
  try {
    const existingUsersCount = await User.countDocuments();

    if (existingUsersCount > 0) {
      console.log("Users already seeded. Skipping seeding process.");
      return;
    }

    const password = "Qwe@1234";

    const mockUsers = [
      { username: "admin", password, role: "admin" },
      { username: "reviewer1", password, role: "reviewer" },
      { username: "reviewer2", password, role: "reviewer" },
      { username: "creator1", password, role: "creator" },
    ];

    for (let u of mockUsers) {
      const userExists = await User.findOne({ username: u.username });
      if (!userExists) {
        // For Admin, extra check: Ensure only one user has the Admin role
        if (u.role === "admin") {
          const anyAdmin = await User.findOne({ role: "admin" });
          if (anyAdmin) {
            console.log("Admin user already exists, skipping admin seeding.");
            continue;
          }
        }
        await User.create(u);
        console.log(`Created user: ${u.username}`);
      } else {
        // Update role and password for existing mock users
        userExists.password = password;
        userExists.role = u.role;
        await userExists.save();
        console.log(`Updated user: ${u.username}`);
      }
    }
  } catch (error) {
    console.error("Seeding error:", error);
  }
};

module.exports = seedData;
