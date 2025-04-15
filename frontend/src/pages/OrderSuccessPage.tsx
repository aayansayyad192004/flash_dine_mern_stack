import { FC } from "react";
import { CheckCircle } from "lucide-react";

const OrderSuccessPage: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center border border-green-200">
        <div className="flex justify-center mb-4">
          <CheckCircle size={64} className="text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful</h1>
        <p className="text-gray-600">
          Your order has been placed successfully.
        </p>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
