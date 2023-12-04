const orderModel = require("../models/order");
const cartModel = require("../models/cart");
const productModel = require("../models/product");
const { updateCart } = require("./cart");
const { userModel } = require("../models/userModel");
const { now } = require("mongoose");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

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
  const { city, street, province, zip, fullName } = orderData;
  // Check if any product in the cart or single product lacks the 'quantity' property
  const hasQuantityObject = product.some(
    (item) => typeof item === "object" && "quantityInStock" in item
  );

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
        name: fullName,
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
      //clear cart:
      if (cartID) {
        console.log(cartID);
        try {
          const deletedCart = await cartModel.findByIdAndDelete(cartID);
      
          for (const item of product) {
            const productDoc = await productModel.findById(item.productId);
      
            if (productDoc.quantityInStock >= item.quantity) {
              const newQuantity = productDoc.quantityInStock - item.quantity;
              const newSold = productDoc.sold + item.quantity;
              console.log("ssss", newQuantity, newSold);
      
              const updatedProduct = await productModel.updateOne(
                { _id: item.productId },
                {
                  quantityInStock: newQuantity,
                  sold: newSold,
                }
              );
            } else {
              // Handle insufficient quantity error if needed
              console.log("Insufficient quantity error");
            }
          }
      
          // Send the response only once after processing all products
          res.status(201).json({ message: "order success", data: order });
        } catch (error) {
          // Handle errors, log them, or send an appropriate response
          console.error("Error:", error);
          res.status(500).json({ message: "Internal server error" });
        }
      }
       else {
        res.status(201).json({ message: "order success", data: order });
      }
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
        name: fullName,
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

            // Update product quantities

      // const productDoc = await productModel.findById(product[0]._id);
      if (product[0].quantityInStock >= quantity) {
        const newQuantity = product[0].quantityInStock - quantity;
        const newSold = product[0].sold + quantity;
        console.log("ssss", newQuantity, newSold);
        const productDoc = await productModel.findById(product[0]._id);
        if (productDoc) {
          const NEWproduct = await productModel.updateOne(
            { _id: product[0]._id },
            {
              quantityInStock: newQuantity,
              sold: newSold,
            }
          );
          res.status(201).json({ message: "order success", data: order2 });
        } else {
          res.status(201).json({ message: "order success", data: order2 });
        }
      } else {
        res.status(201).json({ message: "order success", data: order2 });
      }
      // console.log(paymentIntent.client_secret, "key");
   
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
    // console.log(error);
  }
};

//create cash order
const createCashOrder = async (req, res) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  const userId = req.id;
  const { amount, orderData, product, payMethod, cartID } = req.body;
  const { city, street, province, zip, fullName } = orderData;
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
        name: fullName,
        shippingAddress: { street, province, zip, city },
        cartItems: product.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        paymentMethodType: payMethod,
        totalOrderPrice: totalOrderPrice,
      });

      //clear cart:
      if (cartID) {
        console.log(cartID);
        try {
          const deletedCart = await cartModel.findByIdAndDelete(cartID);
      
          for (const item of product) {
            const productDoc = await productModel.findById(item.productId);
      
            if (productDoc.quantityInStock >= item.quantity) {
              const newQuantity = productDoc.quantityInStock - item.quantity;
              const newSold = productDoc.sold + item.quantity;
              console.log("ssss", newQuantity, newSold);
      
              const updatedProduct = await productModel.updateOne(
                { _id: item.productId },
                {
                  quantityInStock: newQuantity,
                  sold: newSold,
                }
              );
            } else {
              // Handle insufficient quantity error if needed
              console.log("Insufficient quantity error");
            }
          }
      
          // Send the response only once after processing all products
          res.status(201).json({ message: "order success", data: order });
        } catch (error) {
          // Handle errors, log them, or send an appropriate response
          console.error("Error:", error);
          res.status(500).json({ message: "Internal server error" });
        }
      }
       else {
        res.status(201).json({ message: "order success", data: order });
      }
    } else {
      const { quantity } = req.body.product[1];
      const totalPrice = quantity * amount;
      // console.log("single product", quantity, totalPrice);
      const order2 = await orderModel.create({
        user: userId,
        name: fullName,
        shippingAddress: { street, province, zip, city },
        cartItems: {
          productId: product[0]._id,
          quantity: quantity,
          price: product[0].price,
        },
        paymentMethodType: payMethod,
        totalOrderPrice: totalPrice,
      });

      // Update product quantities

      // const productDoc = await productModel.findById(product[0]._id);
      if (product[0].quantityInStock >= quantity) {
        const newQuantity = product[0].quantityInStock - quantity;
        const newSold = product[0].sold + quantity;
        console.log("ssss", newQuantity, newSold);
        const productDoc = await productModel.findById(product[0]._id);
        if (productDoc) {
          const NEWproduct = await productModel.updateOne(
            { _id: product[0]._id },
            {
              quantityInStock: newQuantity,
              sold: newSold,
            }
          );
          res.status(201).json({ message: "order success", data: order2 });
        } else {
          res.status(201).json({ message: "order success", data: order2 });
        }
      } else {
        res.status(201).json({ message: "order success", data: order2 });
      }

      // res.status(201).json({ message: "order success", data: order2 });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
    // console.log(error);
  }
};
// delete order by id
const deleteOrder = async (req, res) => {
  const orderId = req.params.orderId;
  console.log(orderId, "delete");

  try {
    const deletedOrder = await orderModel.findByIdAndDelete(orderId);

    if (deletedOrder) {
      return res.status(204).json({ message: "Order deleted successfully" });
    } else {
      return res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error deleting order:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// get orders for admin
const getAllOrdersForAdmin = async (req, res) => {
  const { id } = req;
  console.log(id, "seller id");
  const idObject = new ObjectId(id);
  try {
    const orders = await orderModel.find().populate("cartItems.productId"); // Find products with  createdBy in orders
    if (orders) {
      const orderedProducts = orders.reduce((result, order) => {
        order.cartItems.forEach((cartItem) => {
          if (cartItem.productId.createdBy.equals(idObject)) {
            result.push({
              product: cartItem.productId,
              quantity: cartItem.quantity,
            });
          }
        });
        return result;
      }, []);
      let totalSales = 0;

      orderedProducts.forEach((item) => {
        const product = item.product;
        const quantity = item.quantity;
        const productTotal = product.price * quantity;

        totalSales += productTotal;
      });

      res.status(200).json({ orderedProducts, totalSales });
    } else {
      res.status(200).json({ orderedProducts: [] });
    }
  } catch (error) {
    console.error(error);
    res.status(201).send({ orderedProducts: [] });
  }
};
// get all customers for admin
const getAllCustomersForAdmin = async (req, res) => {
  const { id } = req;
  const idObject = new ObjectId(id);

  try {
    const orders = await orderModel
      .find()
      .populate("user")
      .populate("cartItems.productId"); // Find products with  createdBy in orders
    if (orders) {
      const orderedProducts = orders.reduce((result, order) => {
        let customer = order.user._id;
        let email = order.user.email;
        let name = order.user.name;
        order.cartItems.forEach((cartItem) => {
          if (cartItem.productId.createdBy.equals(idObject)) {
            result.push({
              customer: customer,
              email: email,
              name: name,
              product: cartItem.productId,
              quantity: cartItem.quantity,
            });
          }
        });
        return result;
      }, []);
      // for total sales
      let totalSales = 0;

      orderedProducts.forEach((item) => {
        const product = item.product;
        const quantity = item.quantity;
        const productTotal = product.price * quantity;

        totalSales += productTotal;
      });
      const customerData = {};

      orderedProducts.forEach((order) => {
        const { customer, email, name, product, quantity } = order;
        if (!customerData[customer]) {
          customerData[customer] = [];
        }
        if (!customerData[customer]) {
          customerData[customer] = [];
        }
        const existingProduct = customerData[customer].find(
          (p) => p.product._id === product._id
        );
        // const existingName = customerData[customer].find(p => p.name === name);
        if (existingProduct) {
          existingProduct.quantity += quantity;
        } else {
          customerData[customer].push({
            // name,
            product,
            quantity,
          });
        }
        // if(existingName){
        //   customerData[customer].push({
        //     name:''})
        // }else{
        //   customerData[customer].push({
        //     name})
        // }
      });
      const organizedData = Object.keys(customerData).map((customerId) => ({
        customer: { ID: customerId, name: "", email: "" },
        products: customerData[customerId],
      }));
      const clientsData = await Promise.all(
        organizedData.map(async (order) => {
          let customer = await userModel.findById(order.customer.ID);
          if (customer) {
            order.customer.name = customer.name;
            order.customer.email = customer.email;
            return order;
          }
        })
      );

      res.status(200).json({ clients: clientsData, message: "success" });
    } else {
      res.status(200).json({ orderedProducts: [], message: "no orders yet" });
    }
  } catch (error) {
    console.error(error);
    res.status(201).send({ orderedProducts: [], message: "error in data" });
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
  getAllOrdersForAdmin,
  getAllCustomersForAdmin,
  updateOrderToPaid,
  updateOrderTODelivered,
  chechOutSession,
  payByStripe,
};
