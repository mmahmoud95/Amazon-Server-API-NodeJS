const express = require("express");
var router = express.Router();
var {createCashOrder,getAllOrders,getAllOrdersForAdmin,getSpecificUserOrder,updateOrderToPaid,deleteOrder,updateOrderTODelivered,chechOutSession, payByStripe, getAllCustomersForAdmin}=require('../controllers/order');
const {auth}=require('../middlewares/userAuth');
const {authRole}=require('../middlewares/adminAuth');
// paybystripe
router.post('/card',auth,payByStripe);
router.delete('/:orderId',deleteOrder)
//create cash order:
router.post('/cash',auth,createCashOrder);
//get all orders by admin:
router.get('/allOrders',auth,authRole,getAllOrders);
//get spesific order by user id:
router.get("/userOrders",auth,getSpecificUserOrder);



router.get('/adminOrders',auth,authRole,getAllOrdersForAdmin);
// get customers
router.get('/adminClients',auth,authRole,getAllCustomersForAdmin);

//update order paid status to paid using order id (by admin):
router.patch("/updateOrderToPaid/:orderId",auth,authRole,updateOrderToPaid);
//update order isDelivered status to Delivered using order id (by admin):
router.patch("/updateOrderTODelivered/:orderId",auth,authRole,authRole,updateOrderTODelivered);
//get chechout session from stripe and send it as a response:
router.get('/checkout_session/:cartId',auth,chechOutSession)

module.exports=router