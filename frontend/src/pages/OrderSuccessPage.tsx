import { FC } from "react";
import { CheckCircle, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const OrderSuccessPage: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center border border-yellow-200 transition-all duration-500">
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-100 rounded-full p-4">
            <UtensilsCrossed size={48} className="text-yellow-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bon Appétit!</h1>
        <p className="text-gray-600 mb-4">Your order has been placed successfully.</p>

        <div className="flex justify-center mb-6">
          <CheckCircle size={48} className="text-green-500" />
        </div>

        <p className="text-gray-500 mb-6">
          Sit back and relax while we prepare your delicious meal. You'll receive updates shortly.
        </p>

        <Link to="/orders">
          <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold">
            Track My Order
          </Button>
        </Link>

        <Link to="/">
          <Button
            variant="outline"
            className="w-full mt-3 border-yellow-500 text-yellow-600 hover:bg-yellow-100"
          >
            Back to Menu
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
