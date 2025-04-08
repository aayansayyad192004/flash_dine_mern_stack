import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import UserProfileForm, {
  UserFormData,
} from "@/forms/user-profile-form/UserProfileForm";
import { useGetMyUser } from "@/api/MyUserApi";

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
  const { currentUser, isLoading: isGetUserLoading } = useGetMyUser();

  const onLogin = async () => {
    if (!isAuthenticated && !isAuthLoading) {
      await loginWithRedirect({
        appState: {
          returnTo: pathname,
        },
      });
    }
  };

  // Show loading if auth or user data is being fetched
  if (isAuthLoading || isGetUserLoading || isLoading) {
    return <LoadingButton />;
  }

  // Only show login button if user is not authenticated or user data failed
  if (!isAuthenticated || !currentUser) {
    return (
      <Button
        onClick={onLogin}
        className="bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white font-semibold shadow-md transition-all hover:scale-105 flex-1"
      >
        Log in to check out
      </Button>
    );
  }

  // Authenticated and user data loaded
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          className="bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white font-semibold shadow-md transition-all hover:scale-105 flex-1"
        >
          Go to checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] md:min-w-[700px] bg-[#f0fdf4] rounded-2xl shadow-xl border-l-4 border-green-600">
        <UserProfileForm
          currentUser={currentUser}
          onSave={onCheckout}
          isLoading={isGetUserLoading}
          title="Confirm Delivery Details"
          buttonText="Continue to payment"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutButton;
