import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import UserProfileForm, { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { useGetMyUser } from "@/api/MyUserApi";
import { useState } from "react";

type Props = {
  onCheckout: (userFormData: UserFormData) => void;
  disabled: boolean;
  isLoading: boolean;
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutButton = ({ onCheckout, disabled, isLoading }: Props) => {
  const { isAuthenticated, isLoading: isAuthLoading, loginWithRedirect } = useAuth0();
  const { pathname } = useLocation();
  const { data: currentUser, isLoading: isGetUserLoading } = useGetMyUser();

  const [userFormData, setUserFormData] = useState<UserFormData | null>(null);

  const onLogin = async () => {
    await loginWithRedirect({ appState: { returnTo: pathname } });
  };

  const handleFormSave = (formData: UserFormData) => {
    setUserFormData(formData);
    openRazorpay(formData);
  };

  const openRazorpay = (formData: UserFormData) => {
    const options = {
      key: "rzp_test_YourKeyHere", // replace with real Razorpay key
      amount: 50000, // amount in paise (₹500)
      currency: "INR",
      name: "PetMe Adoption",
      description: "Pet Adoption Order",
      handler: function (response: any) {
        console.log("✅ Payment Success:", response);

        // Place the order now
        onCheckout(formData);
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: "9999999999",
      },
      theme: {
        color: "#F97316", // orange
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
          buttonText="Continue to payment"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutButton;
