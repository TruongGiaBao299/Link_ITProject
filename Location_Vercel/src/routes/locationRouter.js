const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllDistrictAndWard } = require('../controllers/locationController');

// set middleware for all routes
router.all("*", auth);

// Get All Address
router.get("/getall", getAllDistrictAndWard)

module.exports = router;
