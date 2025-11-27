const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/UsersModel");

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");

    const adminEmail = "adminspent@gmail.com";

    const existAdmin = await User.findOne({
      email: adminEmail,
    });
    if (existAdmin) {
      console.log("Admin already exists. No action or changes");
      process.exit(0);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("AdminPassword123", saltRounds);

    await User.create({
      first_name: "Admin",
      last_name: "Admin",
      email: adminEmail,
      role: "admin",
      hash: hashedPassword,
    });

    console.log("Admin seeded into DB");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed: ", err);
    process.exit(0);
  }
};

seedAdmin();
