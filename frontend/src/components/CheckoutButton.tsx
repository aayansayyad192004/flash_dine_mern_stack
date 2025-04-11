import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import UserProfileForm, {
  UserFormData,
} from "@/forms/user-profile-form/UserProfileForm";
import { useGetMyUser } from "@/api/MyUserApi";
import { useEffect, useRef } from "react";

type Props = {
  onCheckout: (userFormData: UserFormData) => void;
  disabled: boolean;
  isLoading: boolean;
};

const CheckoutButton = ({ onCheckout, disabled, isLoading }: Props) => {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    loginWithRedirect,
  } = useAuth0();

  const { pathname } = useLocation();
  const { restaurantId } = useParams(); // ✅ extract restaurantId from URL

  const {
    data: currentUser,
    isLoading: isGetUserLoading,
  } = useGetMyUser();

  const razorpayFormRef = useRef<HTMLDivElement | null>(null);

  const onLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: pathname,
      },
    });
  };

  useEffect(() => {
    // ✅ Load Razorpay script dynamically inside the dialog
    if (razorpayFormRef.current) {
      const existingScript = document.querySelector(
        "script[src='https://checkout.razorpay.com/v1/payment-button.js']"
      );
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/payment-button.js";
        script.setAttribute("data-payment_button_id", "pl_QHS8pZKyf4PAGY"); // Your Razorpay button ID
        script.async = true;
        razorpayFormRef.current.innerHTML = ""; // Clear if re-rendered
        razorpayFormRef.current.appendChild(script);
      }
    }
  }, [razorpayFormRef]);

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
          onSave={(formData: UserFormData) => {
            // ✅ call your onCheckout function
            onCheckout(formData);

            // ✅ Optionally, you can update order status here using restaurantId
            console.log("Checkout triggered for restaurant ID:", restaurantId);
          }}
          isLoading={isGetUserLoading}
          title="Confirm Delivery Details"
          buttonText="Continue to payment"
        />

        {/* ✅ Razorpay Button */}
        <div ref={razorpayFormRef} className="mt-4"></div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutButton;
