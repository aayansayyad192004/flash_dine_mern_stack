import { useEffect, useRef } from "react";
import axios from "axios";

type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

type Props = {
  restaurantId: string;
  cartItems: CartItem[];
  totalPrice: number;
};

const CheckoutButton = ({ restaurantId, cartItems, totalPrice }: Props) => {
  const scriptContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.setAttribute("data-payment_button_id", "pl_QHS8pZKyf4PAGY");
    script.async = true;

    if (scriptContainerRef.current) {
      scriptContainerRef.current.innerHTML = ""; // clear previous Razorpay script
      scriptContainerRef.current.appendChild(script);
    }

    // Razorpay success handler
    const handlePaymentSuccess = async () => {
      try {
        await axios.post("/api/orders", {
          restaurantId,
          cartItems,
          totalPrice,
        });

        // Optional: clear sessionStorage cart after placing order
        sessionStorage.removeItem(`cartItems-${restaurantId}`);
      } catch (error) {
        console.error("Error placing order after payment", error);
      }
    };

    // Listen to Razorpay success (hacky workaround via window event)
    const razorpaySuccessListener = (e: any) => {
      if (e?.data?.event === "razorpay.success") {
        handlePaymentSuccess();
      }
    };

    window.addEventListener("message", razorpaySuccessListener);

    return () => {
      window.removeEventListener("message", razorpaySuccessListener);
    };
  }, [restaurantId, cartItems, totalPrice]);

  return (
    <div className="flex justify-center w-full">
      <form>
        <div ref={scriptContainerRef}></div>
      </form>
    </div>
  );
};

export default CheckoutButton;
