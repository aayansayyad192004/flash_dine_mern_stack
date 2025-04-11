import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useGetMyUser } from "@/api/MyUserApi";
import { toast } from "sonner"; // or your toast library
import { useEffect } from "react";

type Props = {
  disabled: boolean;
};

const CheckoutButton = ({ disabled }: Props) => {
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

  useEffect(() => {
    // Trigger popup when component mounts (simulate order placed)
    toast.success("Your order has been placed!");
  }, []);

  if (!isAuthenticated) {
    return (
      <Button onClick={onLogin} className="bg-orange-500 flex-1">
        Log in to check out
      </Button>
    );
  }

  if (isAuthLoading || !currentUser || isGetUserLoading) {
    return (
      <Button disabled className="bg-gray-400 flex-1">
        Loading...
      </Button>
    );
  }

  return (
    <form className="flex-1">
      <script
        src="https://checkout.razorpay.com/v1/payment-button.js"
        data-payment_button_id="pl_QHS8pZKyf4PAGY"
        async
      ></script>
    </form>
  );
};

export default CheckoutButton;
