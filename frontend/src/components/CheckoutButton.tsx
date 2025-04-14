import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useGetMyUser } from "@/api/MyUserApi";

type Props = {
  onCheckout: () => Promise<any>;
  disabled: boolean;
  isLoading: boolean;
};

const CheckoutButton = ({ isLoading }: Props) => {
  const { isAuthenticated, isLoading: isAuthLoading, loginWithRedirect } = useAuth0();
  const { pathname } = useLocation();
  const { data: currentUser, isLoading: isGetUserLoading } = useGetMyUser();
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (!isAuthenticated || isAuthLoading || isGetUserLoading || !currentUser) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.setAttribute("data-payment_button_id", "pl_QHS8pZKyf4PAGY");
    script.async = true;

    if (formRef.current) {
      formRef.current.innerHTML = ""; // Clear previous script if any
      formRef.current.appendChild(script);
    }

    return () => {
      if (formRef.current) {
        formRef.current.innerHTML = ""; // Clean up when component unmounts
      }
    };
  }, [isAuthenticated, isAuthLoading, isGetUserLoading, currentUser]);

  const onLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: pathname,
      },
    });
  };

  if (!isAuthenticated) {
    return (
      <Button onClick={onLogin} className="bg-orange-500 flex-1">
        Log in to check out
      </Button>
    );
  }

  if (isAuthLoading || isLoading || isGetUserLoading || !currentUser) {
    return (
      <Button className="bg-orange-500 flex-1" disabled>
        Loading...
      </Button>
    );
  }

  return <form ref={formRef} className="flex-1" />;
};

export default CheckoutButton;
