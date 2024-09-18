import { useState } from "react";
import ProductCard from "../component/Product-card";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productApi";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../component/Loader";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";

const Search = () => {
  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError,
    error,
  } = useCategoriesQuery("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const {
    isLoading: productLoading,
    data: searchData,
    isError: productIsError,
    error: productError,
  } = useSearchProductsQuery({
    search,
    sort,
    category,
    page,
    price: maxPrice,
  });

  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");

    dispatch(addToCart(cartItem));
  };
  const isPrevPage = page > 1;

  if (isError) {
    toast.error((error as CustomError).data.message);
  }

  if (productIsError) {
    toast.error((productError as CustomError).data.message);
  }

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>

        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (low to high)</option>
            <option value="dsc">Price (high to low )</option>
          </select>
        </div>

        <div>
          <h4>Max Price : {maxPrice || ""}</h4>
          <input
            type="range"
            min={1000}
            max={200000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            {loadingCategories ||
              categoriesResponse?.categories.map((i) => (
                <option key={i} value={i}>
                  {i.toLocaleUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>

      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {productLoading ? (
          <Skeleton length={10} />
        ) : (
          <div className="search-product-list">
            {searchData &&
              searchData.data.products.map((i) => (
                <ProductCard
                  key={i._id}
                  productId={i._id}
                  name={i.name}
                  photo={`${i.photo}`}
                  price={i.price}
                  stock={i.stock}
                  handler={addToCartHandler}
                />
              ))}
          </div>
        )}

        {searchData && searchData.data.totalPage > 1 && (
          <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              {page} of {searchData.data.totalPage}
            </span>
            <button
              disabled={page < searchData.data.totalPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
};

export default Search;
