const express = require("express");
const { signUpUser,signInUser } = require("../controllers/userController");

const router = express.Router();

// Register a new user
router.post("/sign-up", signUpUser);

// Login a user
router.post("/sign-in", signInUser);

module.exports = router;
