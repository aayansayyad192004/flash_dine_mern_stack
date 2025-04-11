import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, useParams } from "react-router-dom";
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
  const { restaurantId } = useParams();

  const { data: currentUser, isLoading: isGetUserLoading } = useGetMyUser();

  const razorpayFormRef = useRef<HTMLDivElement | null>(null);
  const [showPaymentButton, setShowPaymentButton] = useState(false);

  const onLogin = async () => {
    await loginWithRedirect({ appState: { returnTo: pathname } });
  };

  const handleFormSave = (formData: UserFormData) => {
    onCheckout(formData);
    console.log("Checkout triggered for restaurant ID:", restaurantId);

    // Show Razorpay button AFTER user submits profile form
    setShowPaymentButton(true);

    // Clear previous Razorpay button if it exists
    if (razorpayFormRef.current) {
      razorpayFormRef.current.innerHTML = "";

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/payment-button.js";
      script.setAttribute("data-payment_button_id", "pl_QHS8pZKyf4PAGY"); // Replace with your own Razorpay button ID
      script.async = true;
      razorpayFormRef.current.appendChild(script);
    }
  };

  if (!isAuthenticated) {
    return (
      <Button onClick={onLogin} className="bg-orange-500 flex-1">
        Log in to check out
      </Button>
    );
  }

  if (isAuthLoading || !currentUser || isLoading) {
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

        {/* ✅ Razorpay Button appears only after profile form is submitted */}
        {showPaymentButton && (
          <div ref={razorpayFormRef} className="mt-4"></div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutButton;
