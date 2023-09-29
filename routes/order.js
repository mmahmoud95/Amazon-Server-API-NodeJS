const express = require("express");
var router = express.Router();
var {createCashOrder,getAllOrders,getSpecificUserOrder,updateOrderToPaid,updateOrderTODelivered}=require('../controllers/order');
const {auth}=require('../middlewares/userAuth');
const {authRole}=require('../middlewares/adminAuth');

//create cash order:
router.post('/:cartId',auth,createCashOrder);
router.get('/allOrders',authRole,getAllOrders);
router.get("/userOrders/:userId",auth,getSpecificUserOrder)
router.patch("/updateOrderToPaid/:orderId",authRole,updateOrderToPaid)
router.patch("/updateOrderTODelivered/:orderId",authRole,updateOrderTODelivered)


module.exports=router