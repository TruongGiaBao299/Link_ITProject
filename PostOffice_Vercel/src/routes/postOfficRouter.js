const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createPostOffice, getPostOffice, updatePostOfficeStatus, UnActivePostOfficeStatus, deletePostOffice, getPostOfficeByEmail } = require('../controllers/postOfficeController');

// set middleware for all routes
router.all("*", auth);

// Create post office
router.post("/create", createPostOffice);

// Get post office
router.get("/get", getPostOffice)

// Delete post office
router.delete("/delete/:email", deletePostOffice)

// update postoffice status
router.post("/status/:email", updatePostOfficeStatus)

// update driver status
router.post("/statusnotactive/:email", UnActivePostOfficeStatus)

// Get user order
router.get("/getpostofficeemail", getPostOfficeByEmail)

module.exports = router;
