import { FaPlus } from "react-icons/fa";
import { CartItemTypes } from "../types/types";

type productProps = {
  productId: string;
  name: string;
  photo: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItemTypes) => string | undefined;
};

const server = import.meta.env.VITE_IMAGES_SERVER;

const ProductCard = ({
  productId,
  name,
  photo,
  price,
  stock,
  handler,
}: productProps) => {
  return (
    <div className="product-card">
      <img src={`${server}${photo}`} alt={name} />
      <p>{name}</p>
      <span>₹ {price}</span>

      <div>
        <button
          onClick={() => {
            handler({ productId, price, name, quantity: 1, photo, stock });
          }}
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
