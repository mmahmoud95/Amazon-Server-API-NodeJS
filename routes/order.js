const express = require("express");
var router = express.Router();
var {createCashOrder,getAllOrders}=require('../controllers/order');
const {auth}=require('../middlewares/userAuth');
const {authRole}=require('../middlewares/adminAuth');

//create cash order:
router.post('/:cartId',auth,createCashOrder)
router.get('/',authRole,getAllOrders)


module.exports=router