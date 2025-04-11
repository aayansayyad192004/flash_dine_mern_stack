// src/pages/PaymentPage.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PaymentPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.setAttribute("data-payment_button_id", "pl_QHS8pZKyf4PAGY");
    script.async = true;

    const container = document.getElementById("razorpay-button-container");
    if (container) {
      container.innerHTML = ""; // Clear if already injected
      container.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Complete Your Payment
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Order ID: {orderId}
        </p>
        <div id="razorpay-button-container" />
      </div>
    </div>
  );
};

export default PaymentPage;
