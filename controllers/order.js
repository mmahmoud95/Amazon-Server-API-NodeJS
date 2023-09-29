const orderModel = require("../models/order");
const cartModel = require("../models/cart");
const productModel = require("../models/product");
const { updateCart } = require("./cart");

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
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


//get all orders :
const getAllOrders =async (req,res)=>{
try {
  const orders=await orderModel.find().populate("user").populate("cartItems")
  res.status(200).json(orders)
} catch (error) {
  res.status(500).json({message:error.message})
}
}



module.exports = { createCashOrder, getAllOrders};
