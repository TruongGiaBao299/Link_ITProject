const express = require('express');
const { createUser, handleLogin, getUser, deleteUser, getAccount, becomeDriver, becomeGuest, becomePostOffice, updatePassword } = require('../controllers/userController');
const router = express.Router();
const auth = require('../middleware/auth');

// set middleware for all routes
router.all("*", auth);

// Create user
router.post("/register", createUser);

// Check login
router.post("/login", handleLogin);

// Get user
router.get("/user", getUser)

// Delete user
router.delete("/delete/:id", deleteUser);

// Get account
router.get("/account", getAccount)

// Become driver
router.post("/becomeDriver/:email", becomeDriver);

// Become guest
router.post("/becomeGuest/:email", becomeGuest);

// Become postoffice
router.post("/becomePostOffice/:email", becomePostOffice);

// Update password
router.put("/updatepassword", updatePassword);

module.exports = router;
