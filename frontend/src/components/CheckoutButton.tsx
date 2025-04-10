import { useEffect, useRef } from "react";

const CheckoutButton = () => {
  const scriptContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.setAttribute("data-payment_button_id", "pl_QHS8pZKyf4PAGY");
    script.async = true;

    if (scriptContainerRef.current) {
      scriptContainerRef.current.innerHTML = ""; // Clear any previous scripts
      scriptContainerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="flex justify-center mt-4">
      <form>
        <div ref={scriptContainerRef}></div>
      </form>
    </div>
  );
};

export default CheckoutButton;
