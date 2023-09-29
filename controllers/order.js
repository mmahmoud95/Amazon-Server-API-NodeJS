const orderModel = require("../models/order");
const cartModel = require("../models/cart");
const productModel = require("../models/product");
const { updateCart } = require("./cart");
const { userModel } = require("../models/userModel");

//create cash order
const createCashOrder = async (req, res) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  try {
    //get cart depends on cart id:
    const id = req.params.cartId;
    const cart = await cartModel.findById(id);
    if (!cart) {
      return res
        .status(404)
        .json({ message: "There is no such cart matches this id !" });
    }
    //get order price depend on cart price :
    const cartPrice = cart.bill;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
    var user = req.body.user;
    var cartItems = req.body.cartItems;

    //create order with default payment method (cash):
    const order = await orderModel.create({
      user: user,
      cartItems: cartItems,
      totalOrderPrice: totalOrderPrice,
    });
    //clear cart:
    if (order) {
      await cartModel.findByIdAndDelete(id);
    }
     //response user:
  res.status(201).json({message:"order success", data:order})
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


//get all orders for admin :
const getAllOrders =async (req,res)=>{
try {
  const orders=await orderModel.find().populate("user").populate("cartItems")
  res.status(200).json(orders)
} catch (error) {
  res.status(500).json({message:error.message})
}
}


//get specific user order by user id:
const getSpecificUserOrder=async(req,res)=>{
try {
  const id =req.params.userId;

  // Find the user by their ID
  const user = await userModel.findById(id);
  if(!user){
    return res.status(404).json({ message: "User not found" });
  }

   // Find orders which have this userid:
   const orders = await orderModel.find({ user: user._id });
   res.status(200).json(orders)
} catch (error) {
  res.status(500).json({message:error.message})
}
}



module.exports = { createCashOrder, getAllOrders,getSpecificUserOrder};
