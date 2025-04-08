import Razorpay from "razorpay";
import crypto from "crypto";
import { Request, Response } from "express";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Order from "../models/order";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const getMyOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("restaurant")
      .populate("user");

    res.json(orders);
  } catch (error) {
    console.error(error);
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

const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const newOrder = new Order({
      restaurant: restaurant,
      user: req.userId,
      status: "placed",
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      createdAt: new Date(),
    });

    const totalAmount = calculateTotalAmount(
      checkoutSessionRequest,
      restaurant.menuItems,
      restaurant.deliveryPrice
    );

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount,
      currency: "INR",
      receipt: newOrder._id.toString(),
      payment_capture: true,
    });

    newOrder.totalAmount = totalAmount;
    await newOrder.save();

    res.json({
      razorpayOrderId: razorpayOrder.id,
      orderId: newOrder._id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const calculateTotalAmount = (
  session: CheckoutSessionRequest,
  menuItems: MenuItemType[],
  deliveryPrice: number
): number => {
  let amount = 0;

  session.cartItems.forEach((cartItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString()
    );

    if (!menuItem) {
      throw new Error(`Menu item not found: ${cartItem.menuItemId}`);
    }

    amount += menuItem.price * parseInt(cartItem.quantity);
  });

  return (amount + deliveryPrice) * 100; // in paisa
};

const razorpayWebhookHandler = async (req: Request, res: Response): Promise<void> => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

  const signature = req.headers["x-razorpay-signature"] as string;
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    res.status(400).json({ message: "Invalid signature" });
    return;
  }

  const event = req.body;

  if (event.event === "payment.captured") {
    const razorpayOrderId = event.payload.payment.entity.order_id;
    const order = await Order.findOne({ _id: event.payload.payment.entity.receipt });

    if (order) {
      order.status = "paid";
      order.totalAmount = event.payload.payment.entity.amount;
      await order.save();
    }
  }

  res.status(200).json({ status: "ok" });
};

export default {
  getMyOrders,
  createCheckoutSession,
  razorpayWebhookHandler,
};
