import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { useGetMyUser } from "@/api/MyUserApi";

type Props = {
  onCheckout: () => Promise<any>;
  disabled: boolean;
  isLoading: boolean;
};

const CheckoutButton = ({ onCheckout, disabled, isLoading }: Props) => {
  const { isAuthenticated, isLoading: isAuthLoading, loginWithRedirect } = useAuth0();
  const { pathname } = useLocation();
  const { data: currentUser, isLoading: isGetUserLoading } = useGetMyUser();

  const onLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: pathname,
      },
    });
  };

  const handleCheckout = async () => {
    try {
      const order = await onCheckout();
      if (order?.url) {
        window.location.href = order.url;
      } else {
        console.error("Checkout session URL not available.");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

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
    <Button
      onClick={handleCheckout}
      disabled={disabled}
      className="bg-orange-500 flex-1"
    >
      Proceed to Payment
    </Button>
  );
};

export default CheckoutButton;
