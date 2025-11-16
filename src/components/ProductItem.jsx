// // import React, { useContext } from "react";
// // import { ShopContext } from "../context/ShopContext";
// // import { Link } from "react-router-dom";

// // const ProductItem = ({ id, image, name, price }) => {
// //   const { currency } = useContext(ShopContext);

// //   return (
// //     <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
// //       <div className="overflow-hidden">
// //         <img
// //           className="transition ease-in-out hover:scale-110"
// //           src={image[0]}
// //           alt="Product"
// //         />
// //       </div>
// //       <p className="pt-3 pb-1 text-sm">{name}</p>
// //       <p className="text-sm font-medium">
// //         {currency}&nbsp;
// //         {price.toLocaleString(undefined, {
// //           minimumFractionDigits: 2,
// //           maximumFractionDigits: 2,
// //         })}
// //       </p>
// //     </Link>
// //   );
// // };

// // export default ProductItem;







// import React, { useContext } from "react";
// import { ShopContext } from "../context/ShopContext";
// import { Link } from "react-router-dom";

// const ProductItem = ({ id, image, name, price }) => {
//   const { currency } = useContext(ShopContext);

//   return (
//     <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
//       <div className="overflow-hidden">
//         <img
//           className="transition ease-in-out hover:scale-110"
//           src={image}   // ✅ fixed here
//           alt={name}
//         />
//       </div>
//       <p className="pt-3 pb-1 text-sm">{name}</p>
//       <p className="text-sm font-medium">
//         {currency}&nbsp;
//         {price.toLocaleString(undefined, {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         })}
//       </p>
//     </Link>
//   );
// };

// export default ProductItem;










import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      {/* Image Container - Fixed aspect ratio */}
      <div className="overflow-hidden aspect-square">
        <img
          className="w-full h-full object-cover transition ease-in-out hover:scale-110"
          src={image}
          alt={name}
        />
      </div>
      
      {/* Product Name */}
      <p className="pt-3 pb-1 text-sm">{name}</p>
      
      {/* Product Price */}
      <p className="text-sm font-medium">
        {currency}&nbsp;
        {price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    </Link>
  );
};

export default ProductItem;