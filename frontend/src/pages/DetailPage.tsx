import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";

import { useGetRestaurant } from "@/api/RestaurantApi";
import { useCreateCheckoutSession } from "@/api/OrderApi";
import { useGetMyUser } from "@/api/MyUserApi";

import MenuItem from "@/components/MenuItem";
import OrderSummary from "@/components/OrderSummary";
import RestaurantInfo from "@/components/RestaurantInfo";
import CheckoutButton from "@/components/CheckoutButton";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardFooter } from "@/components/ui/card";

import { MenuItem as MenuItemType } from "../types";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

const DetailPage = () => {
  const { restaurantId } = useParams();

  if (!restaurantId) {
    return <Navigate to="/" replace />;
  }

  const { restaurant, isLoading } = useGetRestaurant(restaurantId);
  const { createCheckoutSession} = useCreateCheckoutSession();
  const { data: currentUser } = useGetMyUser();

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCartItems = sessionStorage.getItem(`cartItems-${restaurantId}`);
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  useEffect(() => {
    sessionStorage.setItem(`cartItems-${restaurantId}`, JSON.stringify(cartItems));
  }, [cartItems, restaurantId]);

  const addToCart = (menuItem: MenuItemType) => {
    setCartItems((prevCartItems) => {
      const existingCartItem = prevCartItems.find((cartItem) => cartItem._id === menuItem._id);

      if (existingCartItem) {
        return prevCartItems.map((cartItem) =>
          cartItem._id === menuItem._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [
        ...prevCartItems,
        {
          _id: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (cartItem: CartItem) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => cartItem._id !== item._id)
    );
  };

 const onCheckout = async () => {
    if (!restaurant || !currentUser) {
      console.error("Restaurant or user not loaded yet.");
      return;
    }

    const checkoutData = {
      cartItems: cartItems.map((cartItem) => ({
        menuItemId: cartItem._id,
        name: cartItem.name,
        quantity: cartItem.quantity.toString(),
      })),
      restaurantId: restaurant._id,
      deliveryDetails: {
        name: currentUser.name || "Guest",
        addressLine1: currentUser.addressLine1 || "N/A",
        city: currentUser.city || "N/A",
        country: currentUser.country || "N/A",
        email: currentUser.email || "guest@example.com",
      },
    };

    try {
      const data = await createCheckoutSession(checkoutData);
      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout session creation failed:", data);
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  if (isLoading || !restaurant) {
    return <div className="text-center py-10 text-lg font-medium">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-10">
      <AspectRatio ratio={16 / 5}>
        <img
          src={restaurant.imageUrl || "/default-restaurant.jpg"}
          className="rounded-md object-cover h-full w-full"
          alt="Restaurant"
        />
      </AspectRatio>

      <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
        <div className="flex flex-col gap-4">
          <RestaurantInfo restaurant={restaurant} />
          <span className="text-2xl font-bold tracking-tight">Menu</span>
          {restaurant.menuItems?.length > 0 ? (
            restaurant.menuItems.map((menuItem) => (
              <MenuItem
                key={menuItem._id}
                menuItem={menuItem}
                addToCart={() => addToCart(menuItem)}
              />
            ))
          ) : (
            <p className="text-gray-500">No menu items available.</p>
          )}
        </div>

        <div>
          <Card>
            <OrderSummary
              restaurant={restaurant}
              cartItems={cartItems}
              removeFromCart={removeFromCart}
            />
            <CardFooter>
            <CheckoutButton />

            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
