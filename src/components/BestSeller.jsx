
// export default BestSeller;
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    // Filter products that are marked as bestSeller
    const bestProducts = products.filter((item) => item.bestSeller);
    // Take top 5 best sellers
    setBestSeller(bestProducts.slice(0, 5));
  }, [products]); // <-- update whenever products change

  return (
    <div className="my-10">
      <div className="py-8 text-3xl text-center">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs text-gray-600 sm:text-sm md:text-base">
          Our best sellers are a curated selection of top-rated items that have
          won over shoppers with their quality, style, and value.
        </p>
      </div>

      {/* Best Seller Products */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
        {bestSeller.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No best sellers found
          </p>
        ) : (
          bestSeller.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              image={Array.isArray(item.image) ? item.image[0] : item.image}
              price={item.price}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BestSeller;
