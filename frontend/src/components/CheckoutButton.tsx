import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useGetMyUser } from "@/api/MyUserApi";

type Props = {
  onCheckout: () => Promise<any>;
  disabled: boolean;
  isLoading: boolean;
};

const CheckoutButton = ({  isLoading }: Props) => {
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

  if (!isAuthenticated) {
    return (
      <Button onClick={onLogin} className="bg-orange-500 flex-1">
        Log in to check out
      </Button>
    );
  }

  if (isAuthLoading || !currentUser || isLoading || isGetUserLoading) {
    return <Button className="bg-orange-500 flex-1" disabled>Loading...</Button>;
  }

  return (
    <form>
      <script
        src="https://checkout.razorpay.com/v1/payment-button.js"
        data-payment_button_id="pl_QHS8pZKyf4PAGY"
        async
      />
    </form>
  );
};

export default CheckoutButton;
