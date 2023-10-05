import { Product, StateProps } from "@/type";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedPrice from "./FormattedPrice";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { resetCart, saveOrder } from "@/redux/shoppingSlice";

const PaymentForm = () => {
  const dispatch = useDispatch();
  const { productData, userInfo } = useSelector(
    (state: StateProps) => state.shopping
  );

  const [cartAmount, setCartAmount] = useState(0);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    let amt = 0;
    let qty = 0;
    productData.map((product: Product) => {
      amt += product.price * product.quantity;
      qty += product.quantity;
      return;
    });
    setCartAmount(amt);
    setQuantity(qty);
  }, [productData]);

  // ? Stripe Paymetnt
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );
  const { data: session } = useSession();
  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const response = await fetch("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: productData,
        email: session?.user?.email,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      dispatch(saveOrder({ order: productData, id: data.id }));
      stripe?.redirectToCheckout({ sessionId: data.id });
      dispatch(resetCart());
    } else {
      console.log(response);
      throw new Error("Failed to Create Stripe Payment");
    }
  };
  // ? Stripe Paymetnt

  return (
    <div className="w-full bg-white p-4">
      <h2>Cart Totals</h2>
      <div className="border-b-[1px] border-b-slate-300 py-2">
        <div className="max-w-lg flex items-center justify-between">
          <p className="uppercase font-medium">Subtotal</p>
          <p>
            <FormattedPrice amount={cartAmount} />
          </p>
        </div>
      </div>
      <div className="border-b-[1px] border-b-slate-300 py-2">
        <div className="max-w-lg flex items-center justify-between">
          <p className="uppercase font-medium">Shipping</p>
          <p>
            <FormattedPrice amount={20} />
          </p>
        </div>
      </div>
      <div className="border-b-[1px] border-b-slate-300 py-2">
        <div className="max-w-lg flex items-center justify-between">
          <p className="uppercase font-medium">Total</p>
          <p>
            <FormattedPrice amount={cartAmount + 20} />
          </p>
        </div>
      </div>
      {userInfo ? (
        <button
          onClick={handleCheckout}
          className="bg-black text-slate-100 mt-4 py-3 px-6 hover:bg-orange-950 cursor-pointer duration-200"
        >
          Proceed to Checkout
        </button>
      ) : (
        <div>
          <button className="bg-black text-slate-100 mt-4 py-3 px-6 hover:bg-orange-950 cursor-not-allowed duration-200">
            Proceed to Checkout
          </button>
          <p className="text-base mt-1 text-red-500 font-semibold animate-bounce">
            Proceed to Login
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
