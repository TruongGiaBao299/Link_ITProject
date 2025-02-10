const express = require('express');
const { createOrder, getOrder, deleteOrder, getOrderById, getOrderByEmail, updateOrderDriverStatus, updateOrderShippedStatus, updateOrderCancelledStatus, getDriverOrderByEmail, searchOrder, updateOrderPostOfficeStatus, getPostOfficeOrderByEmail, updateOrderIsShippingStatus, updateOrderPrepareStatus } = require('../controllers/orderController');
const router = express.Router();
const auth = require('../middleware/auth');

// Get order
router.get("/getorder/:id", getOrderById)

// set middleware for all routes
router.all("*", auth);

// Post man Order
// Create order
router.post("/create", createOrder);

// Get order
router.get("/getorder", getOrder)

// Delete order
router.delete("/delete/:id", deleteOrder);

// Get user order
router.get("/getorderemail", getOrderByEmail)

// Post man Driver
// Get driver order
router.get("/getdriverorderbyemail", getDriverOrderByEmail)

// Get driver order
router.get("/getpostofficeorderbyemail", getPostOfficeOrderByEmail)

// update driver for order
router.post("/acceptorder/:id", updateOrderDriverStatus)

// update driver for order
router.post("/isshippingorder/:id", updateOrderIsShippingStatus)

// update driver for order
router.post("/prepare/:id", updateOrderPrepareStatus)

// update shipped status
router.post("/shippedorder/:id", updateOrderShippedStatus)

// update cancelled status
router.post("/canceledorder/:id", updateOrderCancelledStatus)

// search order price
router.post("/checkprice", searchOrder)

// update postoffice for order
router.post("/updatepostoffice/:id", updateOrderPostOfficeStatus)

module.exports = router;
