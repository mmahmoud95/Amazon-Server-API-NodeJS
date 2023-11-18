const orderModel = require("../models/order");
const cartModel = require("../models/cart");
const productModel = require("../models/product");
const { updateCart } = require("./cart");
const { userModel } = require("../models/userModel");
const { now } = require("mongoose");
//stripe
// for payments
const REACT_APP_STRIPE_KEY = "";
const stripe = require("stripe")(process.env.REACT_APP_STRIPE_KEY);

// pay with stripe
const payByStripe = async (req, res) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  const userId = req.id;
  const { amount, orderData, product, payMethod, cartID } = req.body;
  const { city, street, province, zip } = orderData;
  // Check if any product in the cart or single product lacks the 'quantity' property
  const hasQuantityObject = product.some(
    (item) => typeof item === "object" && "quantityInStock" in item
  );

  console.log(req.body);

  try {
    const cartPrice = amount / 100;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    //create order with default payment method (cash):
    if (product && !hasQuantityObject) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
      });

      const order = await orderModel.create({
        user: userId,
        shippingAddress: { street, province, zip, city },
        cartItems: product.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        isPaid: true,
        paymentMethodType: payMethod,
        totalOrderPrice: totalOrderPrice,
      });
      console.log(order, "'this is order from cart");
      //clear cart:
      if (cartID) {
        console.log(cartID);
        const deletedCart = await cartModel.findByIdAndDelete(cartID);
      }
      //response user:
      console.log(paymentIntent.client_secret, "key");
      res.status(201).json({
        message: "order success",
        data: order,
        key: paymentIntent.client_secret,
      });
    } else {
      const { quantity } = req.body.product[1];
      const totalPrice = quantity * (amount / 100);
      console.log("single product", quantity, totalPrice);
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
      });
      const order2 = await orderModel.create({
        user: userId,
        shippingAddress: { street, province, zip, city },
        cartItems: {
          productId: product[0]._id,
          quantity: quantity,
          price: product[0].price,
        },
        isPaid: true,
        paymentMethodType: payMethod,
        totalOrderPrice: totalPrice,
      });
      console.log(paymentIntent.client_secret, "key");
      res.status(201).json({
        message: "order success",
        data: order2,
        key: paymentIntent.client_secret,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error);
  }
};

//create cash order
const createCashOrder = async (req, res) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  const userId = req.id;
  const { amount, orderData, product, payMethod, cartID } = req.body;
  const { city, street, province, zip } = orderData;
  // Check if any product in the cart or single product lacks the 'quantity' property
  const hasQuantityObject = product.some(
    (item) => typeof item === "object" && "quantityInStock" in item
  );

  console.log(req.body);

  try {
    const cartPrice = amount;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    //create order with default payment method (cash):
    if (product && !hasQuantityObject) {
      const order = await orderModel.create({
        user: userId,
        shippingAddress: { street, province, zip, city },
        cartItems: product.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        paymentMethodType: payMethod,
        totalOrderPrice: totalOrderPrice,
      });
      console.log(order, "'this is order from cart");
      //clear cart:
      if (cartID) {
        console.log(cartID);
        const deletedCart = await cartModel.findByIdAndDelete(cartID);
      }
      //response user:
      res.status(201).json({ message: "order success", data: order });
    } else {
      const { quantity } = req.body.product[1];
      const totalPrice = quantity * amount;
      console.log("single product", quantity, totalPrice);
      const order2 = await orderModel.create({
        user: userId,
        shippingAddress: { street, province, zip, city },
        cartItems: {
          productId: product[0]._id,
          quantity: quantity,
          price: product[0].price,
        },
        paymentMethodType: payMethod,
        totalOrderPrice: totalPrice,
      });
      res.status(201).json({ message: "order success", data: order2 });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error);
  }
};
// delete order by id
const deleteOrder=async (req, res) => {
  const orderId = req.params.orderId;
  console.log(orderId,"delete");

  try {
    const deletedOrder = await orderModel.findByIdAndDelete(orderId);

    if (deletedOrder) {
      return res.status(204).json({ message: 'Order deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

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
    const userId = req.id;
    console.log(userId);

    // Find the user by their ID
    const user = await userModel.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find orders which have this userid:
    const orders = await orderModel
      .find({ user: userId })
      .populate("cartItems.productId");
    console.log(orders, "kiiii");
    return res.status(200).json(orders);
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
// const chechOutSession = async (req, res) => {
//   const taxPrice = 0;
//   const shippingPrice = 0;
//   try {
//     //get cart depends on cart id:
//     const id = req.params.cartId;
//     const cart = await cartModel.findById(id);
//     if (!cart) {
//       return res
//         .status(404)
//         .json({ message: "There is no such cart matches this id !" });
//     }
//     //get order price depend on cart price :
//     const cartPrice = cart.bill;
//     const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
//     //hanling product and data:
//     const product = await stripe.products.create({
//       name: "cart_products",
//     });
//     console.log(product);
//     const price = await stripe.prices.create({
//       product: product.id,
//       unit_amount: totalOrderPrice * 100,
//       currency: "egp",
//     });
//     console.log(price);
//     //create stripe checkout session

//     const session = await stripe.checkout.sessions.create({
//       line_items: [
//         {
//           // name: req.user.firstName,
//           //because stripe convert numbers for example from 100 t0 0.10  //
//           // price: totalOrderPrice * 100,
//           // product: {
//           //   price:cart.totalOrderPrice*100,
//           //   currency: 'egp'
//           // },
//           price: price.id,
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${req.protocol}://${req.get("host")}/order`,
//       cancel_url: `${req.protocol}://${req.get("host")}/cart`,
//       // customer_email: req.user.email,
//       client_reference_id: cart._id,
//       // metadata:req.body.Address
//     });
//     //send session response:
//     res.status(200).json({ status: "success", session });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

//checkout session with cart id:

const chechOutSession = async (req, res) => {
  const taxPrice = 150;
  const shippingPrice = 50;
  try {
    var userid = req.id;
    const user = await userModel.findById(userid);
    if (!user) {
      console.log(user);
      return res.status(404).json({ message: "login order" });
    }

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

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "EGP",
            unit_amount: totalOrderPrice * 100,
            product_data: {
              name: user.firstName,
            },
          },
          quantity: 1,

          // name:req.User.firstName,
          // amount:totalOrderPrice*100,
          // currency:'egp',
          // quantity:1,
        },
      ],
      mode: "payment",
      // success_url: `${req.protocol}://${req.get('host')}/order`,
      success_url: `http://localhost:3333/order/userOrders/${userid}`,
      cancel_url: `${req.protocol}://${req.get("host")}/products/result`,
      customer_email: user.email,
      client_reference_id: cart.id,
      client_reference_id: cart.id,
      // payment_intent_data: {
      //   capture_method: "manual",
      // },
    });
    res.status(200).json({ status: "success", session });
    // res.status(200).json({ checkoutUrl: session.url });

    //  res.redirect(303, session.url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCashOrder,
  getAllOrders,
  getSpecificUserOrder,
  deleteOrder,
  updateOrderToPaid,
  updateOrderTODelivered,
  chechOutSession,
  payByStripe,
};
