const orderModel = require("../models/order");
const cartModel = require("../models/cart");
const productModel = require("../models/product");
const { updateCart } = require("./cart");
const { userModel } = require("../models/userModel");
const { now } = require("mongoose");
//stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET);

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
    res.status(201).json({ message: "order success", data: order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get all orders for admin :
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("user")
      .populate("cartItems");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get specific user order by user id:
const getSpecificUserOrder = async (req, res) => {
  try {
    const id = req.params.userId;

    // Find the user by their ID
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find orders which have this userid:
    const orders = await orderModel.find({ user: user._id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update order paid status to paid using order id (by admin):
const updateOrderToPaid = async (req, res) => {
  try {
    const id = req.params.orderId;
    console.log(id);
    const order = await orderModel.findById(id);
    console.log(order);
    if (!order) {
      return res
        .status(404)
        .json({ message: "There is no orders matches this id !" });
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json({ updatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update order isDelivered status to Delivered using order id (by admin):
const updateOrderTODelivered = async (req, res) => {
  try {
    const id = req.params.orderId;
    const order = await orderModel.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ message: "There is no orders matches this id !" });
    }
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json({ updatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







////online payment:(still working on it)
//get chechout session from stripe and send it as a response:
const chechOutSession = async (req, res) => {
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
    //hanling product and data:
    const product = await stripe.products.create({
      name: 'cart_products',
    });
console.log(product);
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: totalOrderPrice*100,
      currency: 'egp',
    });
    console.log(price);
    //create stripe checkout session

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // name: req.user.firstName,
          //because stripe convert numbers for example from 100 t0 0.10  //
          // price: totalOrderPrice * 100,
          // product: {
          //   price:cart.totalOrderPrice*100,
          //   currency: 'egp'
          // },
          price: price.id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.protocol}://${req.get('host')}/order`,
      cancel_url: `${req.protocol}://${req.get('host')}/cart`,
      // customer_email: req.user.email,
      client_reference_id: cart._id,
      // metadata:req.body.Address
    });
    //send session response:
res.status(200).json({status:'success',session})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//checkout session with cart id:

module.exports = {
  createCashOrder,
  getAllOrders,
  getSpecificUserOrder,
  updateOrderToPaid,
  updateOrderTODelivered,
  chechOutSession
};
