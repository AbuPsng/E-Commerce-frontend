import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartItemTypes } from "../types/types";

type CartItemProps = {
  cartItem: CartItemTypes;
  incrementHandler: (cartItem: CartItemTypes) => void;
  decrementHandler: (cartItem: CartItemTypes) => void;
  removeHandler: (id: string) => void;
};

const CartItem = ({
  cartItem,
  incrementHandler,
  decrementHandler,
  removeHandler,
}: CartItemProps) => {
  const { photo, productId, name, price, quantity } = cartItem;

  return (
    <div className="cart-item">
      <img src={`${import.meta.env.VITE_IMAGES_SERVER}${photo}`} alt={name} />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>₹{price}</span>
      </article>

      <div>
        <button onClick={() => decrementHandler(cartItem)}>-</button>
        <p>{quantity}</p>
        <button onClick={() => incrementHandler(cartItem)}>+</button>
      </div>

      <button onClick={() => removeHandler(productId)}>
        <FaTrash />
      </button>
    </div>
  );
};

export default CartItem;
