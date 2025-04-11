import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import UserProfileForm, {
  UserFormData,
} from "@/forms/user-profile-form/UserProfileForm";
import { useGetMyUser } from "@/api/MyUserApi";
import { useState, useRef } from "react";

type Props = {
  onCheckout: (userFormData: UserFormData) => void;
  disabled: boolean;
  isLoading: boolean;
};

const CheckoutButton = ({ onCheckout, disabled, isLoading }: Props) => {
  const { isAuthenticated, isLoading: isAuthLoading, loginWithRedirect } = useAuth0();
  const { pathname } = useLocation();

  const { data: currentUser, isLoading: isGetUserLoading } = useGetMyUser();

  const razorpayFormRef = useRef<HTMLFormElement | null>(null);
  const [showPaymentButton, setShowPaymentButton] = useState(false);

  const onLogin = async () => {
    await loginWithRedirect({ appState: { returnTo: pathname } });
  };

  const renderRazorpayButton = () => {
    if (razorpayFormRef.current) {
      razorpayFormRef.current.innerHTML = "";

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/payment-button.js";
      script.setAttribute("data-payment_button_id", "pl_QHS8pZKyf4PAGY"); // Your Razorpay button ID
      script.async = true;

      razorpayFormRef.current.appendChild(script);
    }
  };

  const handleFormSave = (formData: UserFormData) => {
    onCheckout(formData);
    setShowPaymentButton(true);

    // Delay to ensure <form> is mounted before injecting script
    setTimeout(() => {
      renderRazorpayButton();
    }, 100);
  };

  if (!isAuthenticated) {
    return (
      <Button onClick={onLogin} className="bg-orange-500 flex-1">
        Log in to check out
      </Button>
    );
  }

  if (isAuthLoading || isGetUserLoading || !currentUser || isLoading) {
    return <LoadingButton />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="bg-orange-500 flex-1">
          Go to checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] md:min-w-[700px] bg-gray-50">
        <UserProfileForm
          currentUser={currentUser}
          onSave={handleFormSave}
          isLoading={isGetUserLoading}
          title="Confirm Delivery Details"
          buttonText="Continue to payment"
        />

        {showPaymentButton && (
          <form ref={razorpayFormRef} className="mt-4" />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutButton;
