import { Order } from "@/types";
import { Separator } from "./ui/separator";

type Props = {
  order: Order;
};

const OrderStatusDetail = ({ order }: Props) => {
  if (!order || !order.cartItems || !order.deliveryDetails) {
    return <div>Invalid order details</div>;
  }

  const totalAmount = Number(order.totalAmount);
  const isValidAmount = !isNaN(totalAmount);

  return (
    <div className="space-y-5">
      <div className="flex flex-col">
        <span className="font-bold">Delivering to:</span>
        <span>{order.deliveryDetails.name}</span>
        <span>
          {order.deliveryDetails.addressLine1}, {order.deliveryDetails.city}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold">Your Order</span>
        <ul>
          {order.cartItems.map((item, index) => (
            <li key={index}>
              {item.name} x {item.quantity}
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="font-bold">Total</span>
        {/* Directly display totalAmount in rupees */}
        <span>₹{isValidAmount ? totalAmount.toFixed(2) : "0.00"}</span>
      </div>
    </div>
  );
};

export default OrderStatusDetail;
