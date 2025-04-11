import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button";

const CheckoutButton = () => {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    loginWithRedirect,
  } = useAuth0();

  const onLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: window.location.pathname,
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

  if (isAuthLoading) {
    return <Button disabled className="bg-orange-500 flex-1">Loading...</Button>;
  }

  return (
    <div className="w-full flex justify-center">
      <div
        dangerouslySetInnerHTML={{
          __html: `<form><script src="https://checkout.razorpay.com/v1/payment-button.js" data-payment_button_id="pl_QHS8pZKyf4PAGY" async></script></form>`,
        }}
      />
    </div>
  );
};

export default CheckoutButton;
