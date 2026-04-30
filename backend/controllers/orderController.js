const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";
  const { userId, items, amount, address } = req.body;
  try {
    const newOrder = await orderModel({
      userId,
      items,
      amount,
      address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const options = {
      amount: amount * 100 * 93.09, // INR → paise
      currency: "INR",
      receipt: newOrder._id.toString(),
    };
    const razorpayOrder = await razorpay.orders.create(options);
    res.json({
      success: true,
      order_id: razorpayOrder.id,
      dbOrderId: newOrder._id,
      amount: options.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error",
    });
  }
};


const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
        await orderModel.findByIdAndUpdate(orderId, {
          payment: true,
        });

        res.json({ success: true ,message:"Paid"});
    }else {
        await orderModel.findByIdAndDelete(orderId)
        res.json({ success: false ,message:"Not Paid"});
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false ,message:"Error"});
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({
      userId: req.body.userId.toString().trim()
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const updateStatus = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    await orderModel.findByIdAndUpdate(orderId, {status});
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const removeOrder = async (req, res) => {
  const { id } = req.body;
  try {
    await orderModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Order removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

module.exports = {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  removeOrder
};
