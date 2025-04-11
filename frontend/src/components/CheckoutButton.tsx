import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import UserProfileForm, {
  UserFormData,
} from "@/forms/user-profile-form/UserProfileForm";
import { useGetMyUser } from "@/api/MyUserApi";
import { useEffect, useRef, useState } from "react";

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

  const renderRazorpayButton = () => {
    if (razorpayFormRef.current) {
      razorpayFormRef.current.innerHTML = "";
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/payment-button.js";
      script.setAttribute("data-payment_button_id", "pl_QHS8pZKyf4PAGY"); // Your Razorpay Button ID
      script.async = true;
      razorpayFormRef.current.appendChild(script);
    }
  };

  // 🔍 Check if user already has profile filled
  const isUserProfileComplete = currentUser?.name && currentUser?.address && currentUser?.phone;

  useEffect(() => {
    if (isUserProfileComplete && isAuthenticated && !isGetUserLoading) {
      onCheckout(currentUser); // Trigger backend order logic
      setShowPaymentButton(true); // Show Razorpay
      renderRazorpayButton();
    }
  }, [currentUser, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Button onClick={onLogin} className="bg-orange-500 flex-1">
        Log in to check out
      </Button>
    );
  }

  if (isAuthLoading || isGetUserLoading || isLoading) {
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
        {!isUserProfileComplete ? (
          <UserProfileForm
            currentUser={currentUser}
            onSave={(formData: UserFormData) => {
              onCheckout(formData);
              setShowPaymentButton(true);
              renderRazorpayButton();
            }}
            isLoading={isGetUserLoading}
            title="Confirm Delivery Details"
            buttonText="Continue to payment"
          />
        ) : (
          <>
            <p className="text-gray-700 text-lg font-medium">Profile already complete. Proceed to payment:</p>
          </>
        )}

        {showPaymentButton && (
          <div ref={razorpayFormRef} className="mt-4"></div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutButton;
