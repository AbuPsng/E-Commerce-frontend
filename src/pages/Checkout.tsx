import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useNewOrderMutation } from "../redux/api/orderApi";
import { resetCart } from "../redux/reducer/cartReducer";
import { RootState } from "../redux/store";
import { NewOrderRequest } from "../types/api-types";
import { responseToast } from "../utils/features";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    shippingInfo,
    cartItems,
    subtotal,
    tax,
    discount,
    shippingCharges,
    total,
  } = useSelector((state: RootState) => state.cartReducer);

  const { user } = useSelector((state: RootState) => state.userReducer);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [newOrder] = useNewOrderMutation();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const orderData: NewOrderRequest = {
      shippingInfo,
      orderItems: cartItems,
      subtotal,
      tax,
      discount,
      shippingCharges,
      total,
      user: user!._id,
    };

    console.log(orderData);

    console.log(elements, "element");

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: "http://localhost:5173/orders" },
      redirect: "if_required",
    });

    console.log(paymentIntent, "paymentIntern");

    if (error) {
      console.log(error.message);
      setIsProcessing(false);
      return toast.error(error.message || "Something went wrong");
    }

    if (paymentIntent.status === "succeeded") {
      console.log("Placing order");
      const res = await newOrder(orderData);
      dispatch(resetCart());
      responseToast(res, navigate, "/orders");
      navigate("/orders");
    }

    setIsProcessing(false);
  };

  return (
    <div className="checkout-container">
      <form onSubmit={submitHandler}>
        <PaymentElement />

        <button type="submit" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Pay"}
        </button>
      </form>
    </div>
  );
};

const Checkout = () => {
  const location = useLocation();

  console.log(location);

  const clientSecret: string | undefined = location.state;

  if (!clientSecret) return <Navigate to="/shipping" />;

  return (
    <Elements
      options={{
        clientSecret,
      }}
      stripe={stripePromise}
    >
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
