import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import UserProfileForm, {
  UserFormData,
} from "@/forms/user-profile-form/UserProfileForm";
import { useGetMyUser } from "@/api/MyUserApi";
import { useEffect, useState } from "react";

type Props = {
  onCheckout: (userFormData: UserFormData) => void;
  disabled: boolean;
  isLoading: boolean;
  amount: number; // Dynamic amount in ₹ rupees
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutButton = ({ onCheckout, disabled, isLoading, amount }: Props) => {
  const { isAuthenticated, isLoading: isAuthLoading, loginWithRedirect } = useAuth0();
  const { pathname } = useLocation();
  const { data: currentUser, isLoading: isGetUserLoading } = useGetMyUser();

  const [formData, setFormData] = useState<UserFormData | null>(null);

  const onLogin = async () => {
    await loginWithRedirect({ appState: { returnTo: pathname } });
  };

  const loadRazorpayScript = () => {
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  };

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handleFormSave = (data: UserFormData) => {
    setFormData(data);
    handlePayment(data);
  };

  const handlePayment = (userForm: UserFormData) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: Math.round(amount * 100), // Convert ₹ to paise
      currency: "INR",
      name: "Flash Dine",
      
      handler: function (response: any) {
        console.log("✅ Razorpay Payment Success:", response);
        onCheckout(userForm); // Trigger order placement here
      },
      prefill: {
        name: userForm.name,
        email: userForm.email,
        contact: "8805296210", // You can replace with actual user phone
      },
      theme: {
        color: "#F97316",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
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
          buttonText="Pay Now"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutButton;
