import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItemCard from "../component/CartItem";
import {
  addToCart,
  applyDiscount,
  calculatePrice,
  removeCartItem,
} from "../redux/reducer/cartReducer";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItemTypes } from "../types/types";
import axios from "axios";
import { server } from "../redux/store";

const Cart = () => {
  const { cartItems, subtotal, tax, discount, shippingCharges, total } =
    useSelector(
      (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    );

  const dispatch = useDispatch();

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  const incrementHandler = (cartItem: CartItemTypes) => {
    if (cartItem.quantity >= cartItem.stock)
      return toast.success("Out of stock");
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };

  const decrementHandler = (cartItem: CartItemTypes) => {
    if (cartItem.quantity <= 1) {
      toast.success("Item has been removed");
      return removeHandler(cartItem.productId);
    }
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };

  const removeHandler = (id: string) => {
    toast.success("Item has been removed");
    dispatch(removeCartItem(id));
  };

  useEffect(() => {
    const { token, cancel } = axios.CancelToken.source();

    const timeOutID = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${server}/payment/discount-apply?code=${couponCode}`,
          { cancelToken: token }
        );
        dispatch(applyDiscount(res.data.discount));
        setIsValidCouponCode(true);
        dispatch(calculatePrice());
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        dispatch(applyDiscount(0));
        setIsValidCouponCode(false);
        dispatch(calculatePrice());
      }
    }, 1000);

    return () => {
      clearTimeout(timeOutID);
      cancel();
      setIsValidCouponCode(false);
    };
  }, [couponCode, dispatch]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems, dispatch]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((i) => (
            <CartItemCard
              key={i.productId}
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
              cartItem={i}
            />
          ))
        ) : (
          <h1>Your Cart is empty</h1>
        )}
      </main>
      <aside>
        <p>Subtotal : ₹{subtotal}</p>
        <p>ShippingCharges : ₹{shippingCharges}</p>
        <p>Tax : ₹{tax}</p>

        <p>
          Discount:<em className="red"> - ₹{discount}</em>
        </p>

        <p>
          <b>Total : ₹{total}</b>
        </p>

        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              {" "}
              ₹ {discount} off using the coupon <code>{couponCode}</code>{" "}
            </span>
          ) : (
            <span onClick={() => setIsValidCouponCode(false)} className="red">
              Invalid Coupon <VscError />{" "}
            </span>
          ))}

        {cartItems.length > 0 && <Link to="/shipping">Check Out</Link>}
      </aside>
    </div>
  );
};

export default Cart;
