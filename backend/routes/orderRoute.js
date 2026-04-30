const express = require('express'); 
const { placeOrder, verifyOrder ,userOrders, listOrders,updateStatus, removeOrder} = require("../controllers/orderController.js") ;
const authMiddleware = require('../middleware/auth.js');

const orderRoute = express.Router()

orderRoute.post('/place',authMiddleware,placeOrder);
orderRoute.post("/verify", verifyOrder);
orderRoute.post("/userorders", authMiddleware, userOrders);
orderRoute.get("/list", listOrders);
orderRoute.post("/status", updateStatus);
orderRoute.post("/remove", removeOrder);

module.exports = orderRoute;