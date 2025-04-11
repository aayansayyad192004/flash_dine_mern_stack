import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { useGetMyUser } from "@/api/MyUserApi";
import { useEffect, useRef } from "react";

type Props = {
  onCheckout?: () => void;
  disabled: boolean;
  isLoading: boolean;
};

const CheckoutButton = ({  isLoading }: Props) => {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    loginWithRedirect,
  } = useAuth0();

  const { pathname } = useLocation();
  const { data: currentUser, isLoading: isGetUserLoading } = useGetMyUser();
  const razorpayRef = useRef<HTMLDivElement>(null);

  const onLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: pathname,
      },
    });
  };

  useEffect(() => {
    if (isAuthenticated && razorpayRef.current) {
      razorpayRef.current.innerHTML = "";

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/payment-button.js";
      script.setAttribute("data-payment_button_id", "pl_QHS8pZKyf4PAGY");
      script.async = true;

      razorpayRef.current.appendChild(script);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Button onClick={onLogin} className="bg-orange-500 flex-1">
        Log in to check out
      </Button>
    );
  }

  if (isAuthLoading || !currentUser || isLoading || isGetUserLoading) {
    return <LoadingButton />;
  }

  return (
    <div className="w-full flex justify-center">
      <div ref={razorpayRef}></div>
    </div>
  );
};

export default CheckoutButton;
