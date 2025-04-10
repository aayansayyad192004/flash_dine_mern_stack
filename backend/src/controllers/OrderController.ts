import Razorpay from "razorpay";
import crypto from "crypto";
import { Request, Response } from "express";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Order from "../models/order";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

const FRONTEND_URL = process.env.FRONTEND_URL as string;

const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("restaurant")
      .populate("user");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
};

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const totalAmount = calculateTotalAmount(
      checkoutSessionRequest,
      restaurant.menuItems,
      restaurant.deliveryPrice
    );

    const newOrder = new Order({
      restaurant: restaurant,
      user: req.userId,
      status: "created",
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      totalAmount,
      createdAt: new Date(),
    });

    await newOrder.save();

    const options = {
      amount: totalAmount,
      currency: "INR",
      receipt: newOrder._id.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const razorpayWebhookHandler = async (req: Request, res: Response) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

  const signature = req.headers["x-razorpay-signature"] as string;
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (generatedSignature !== signature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  const event = req.body;

  if (event.event === "payment.captured") {
    const razorpayOrderId = event.payload.payment.entity.order_id;

    const order = await Order.findOne({ _id: razorpayOrderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "paid";
    await order.save();
  }

  res.status(200).json({ received: true });
};

const calculateTotalAmount = (
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: MenuItemType[],
  deliveryPrice: number
) => {
  let total = 0;

  checkoutSessionRequest.cartItems.forEach((cartItem) => {
    const item = menuItems.find(
      (i) => i._id.toString() === cartItem.menuItemId.toString()
    );

    if (item) {
      total += item.price * parseInt(cartItem.quantity);
    }
  });

  total += deliveryPrice;
  return total * 100; // Convert to paise
};

export default {
  getMyOrders,
  createCheckoutSession,
  razorpayWebhookHandler,
};
