import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import OrderController from "../controllers/OrderController";

const router = express.Router();

// Get all orders for a user
router.get("/", jwtCheck, jwtParse, (req, res) => {
  OrderController.getMyOrders(req, res);
});

// Create Razorpay checkout session
router.post("/checkout/create-checkout-session", jwtCheck, jwtParse, (req, res) => {
  OrderController.createCheckoutSession(req, res);
});

// Razorpay webhook handler (must come AFTER express.raw middleware in main file)
router.post("/checkout/webhook", express.json(), (req, res) => {
  OrderController.razorpayWebhookHandler(req, res);
});

export default router;
