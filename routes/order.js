const express = require("express");
var router = express.Router();
var {createCashOrder,getAllOrders,getSpecificUserOrder,updateOrderToPaid,updateOrderTODelivered,chechOutSession}=require('../controllers/order');
const {auth}=require('../middlewares/userAuth');
const {authRole}=require('../middlewares/adminAuth');

//create cash order:
router.post('/:cartId',auth,createCashOrder);
//get all orders by admin:
router.get('/allOrders',auth,authRole,getAllOrders);
//get spesific order by user id:
router.get("/userOrders/:userId",auth,getSpecificUserOrder);
//update order paid status to paid using order id (by admin):
router.patch("/updateOrderToPaid/:orderId",auth,authRole,updateOrderToPaid);
//update order isDelivered status to Delivered using order id (by admin):
router.patch("/updateOrderTODelivered/:orderId",auth,authRole,authRole,updateOrderTODelivered);
//get chechout session from stripe and send it as a response:
router.get('/checkout_session/:cartId',auth,chechOutSession)

module.exports=router