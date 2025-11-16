


// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import { assets } from "../assets/assets";
// import Title from "../components/Title";
// import ProductItem from "../components/ProductItem";
// import axios from "axios";
// import { backendUrl } from "../App";

// const Collection = () => {
//   const { products, search, showSearch, loading } = useContext(ShopContext);
//   const [showFilter, setShowFilter] = useState(false);
//   const [filterProducts, setFilterProducts] = useState([]);
//   const [category, setCategory] = useState([]);
//   const [subCategory, setSubCategory] = useState([]);
//   const [sortType, setSortType] = useState("relevant");
  
//   // 👇 NEW: Dynamic filters from API
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);

//   // 👇 NEW: Fetch categories and subcategories from API
//   const fetchFilters = async () => {
//     try {
//       const [catRes, subRes] = await Promise.all([
//         axios.get(`${backendUrl}/api/product/categories`),
//         axios.get(`${backendUrl}/api/product/subcategories`),
//       ]);
//       setCategories(catRes.data.data);
//       setSubCategories(subRes.data.data);
//     } catch (error) {
//       console.error("Failed to fetch filters:", error);
//     }
//   };

//   // 👇 NEW: Fetch filters on component mount
//   useEffect(() => {
//     fetchFilters();
//   }, []);

//   const toggleCategory = (e) => {
//     if (category.includes(e.target.value)) {
//       setCategory((prev) => prev.filter((item) => item !== e.target.value));
//     } else {
//       setCategory((prev) => [...prev, e.target.value]);
//     }
//   };

//   const toggleSubCategory = (e) => {
//     if (subCategory.includes(e.target.value)) {
//       setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
//     } else {
//       setSubCategory((prev) => [...prev, e.target.value]);
//     }
//   };

//   const applyFilter = () => {
//     let productsCopy = products.slice();

//     if (showSearch && search) {
//       productsCopy = productsCopy.filter((item) =>
//         item.name.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (category.length > 0) {
//       productsCopy = productsCopy.filter((item) =>
//         category.includes(item.category)
//       );
//     }
//     if (subCategory.length > 0) {
//       productsCopy = productsCopy.filter((item) =>
//         subCategory.includes(item.subCategory)
//       );
//     }

//     setFilterProducts(productsCopy);
//   };

//   const sortProduct = () => {
//     let fpCopy = filterProducts.slice();

//     switch (sortType) {
//       case "low-high":
//         setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
//         break;
//       case "high-low":
//         setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
//         break;
//       default:
//         applyFilter();
//         break;
//     }
//   };

//   const clearFilters = () => {
//     setCategory([]);
//     setSubCategory([]);
//   };

//   useEffect(() => {
//     applyFilter();
//   }, [category, subCategory, search, showSearch, products]);

//   useEffect(() => {
//     sortProduct();
//   }, [sortType]);

//   return (
//     <div className="flex flex-col gap-1 pt-10 border-t sm:flex-row sm:gap-10">
//       {/* Filter Options */}
//       <div className="min-w-60">
//         <p
//           onClick={() => setShowFilter(!showFilter)}
//           className="flex items-center gap-2 my-2 text-xl cursor-pointer"
//         >
//           FILTERS
//           <img
//             className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
//             src={assets.dropdown_icon}
//             alt="Dropdown"
//           />
//         </p>
        
//         {/* 👇 UPDATED: Dynamic Category Filters */}
//         <div
//           className={`border border-gray-300 pl-5 py-3 mt-6 ${
//             showFilter ? "" : "hidden"
//           } sm:block`}
//         >
//           <p className="mb-3 text-sm font-medium">CATEGORIES</p>
//           <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
//             {categories.map((cat) => (
//               <label key={cat._id} className="flex gap-2 cursor-pointer">
//                 <input
//                   className="w-3"
//                   type="checkbox"
//                   value={cat.name}
//                   onChange={toggleCategory}
//                   checked={category.includes(cat.name)}
//                 />
//                 {cat.name}
//               </label>
//             ))}
//           </div>
//         </div>
        
//         {/* 👇 UPDATED: Dynamic Sub Category Filters */}
//         <div
//           className={`border border-gray-300 pl-5 py-3 my-5 ${
//             showFilter ? "" : "hidden"
//           } sm:block`}
//         >
//           <p className="mb-3 text-sm font-medium">TYPES</p>
//           <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
//             {subCategories.map((sub) => (
//               <label key={sub._id} className="flex gap-2 cursor-pointer">
//                 <input
//                   className="w-3"
//                   type="checkbox"
//                   value={sub.name}
//                   onChange={toggleSubCategory}
//                   checked={subCategory.includes(sub.name)}
//                 />
//                 {sub.name}
//               </label>
//             ))}
//           </div>
//         </div>
        
//         {/* Clear Filters Button */}
//         <button
//           className={`px-4 py-2 mt-1 text-white bg-black rounded hover:bg-gray-900 ${
//             showFilter ? "block" : "hidden"
//           } sm:block`}
//           onClick={clearFilters}
//         >
//           Clear Filters
//         </button>
//       </div>

//       {/* View Product Items */}
//       <div className="flex-1">
//         <div className="flex justify-between mb-4 text-base sm:text-2xl">
//           <Title text1={"ALL"} text2={"COLLECTIONS"} />
//           {/* Product Sort */}
//           <select
//             onChange={(e) => setSortType(e.target.value)}
//             className="px-2 text-sm border-2 border-gray-300"
//           >
//             <option value="relevant">Sort by: Relevant</option>
//             <option value="low-high">Sort by: Low to High</option>
//             <option value="high-low">Sort by: High to Low</option>
//           </select>
//         </div>

//         <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 gap-y-6">
//           {loading ? (
//             // show loading skeletons
//             Array(8)
//               .fill(null)
//               .map((_, index) => (
//                 <div
//                   key={index}
//                   className="h-64 bg-gray-200 animate-pulse rounded-xl"
//                 ></div>
//               ))
//           ) : (
//             filterProducts.map((item, index) => (
//               <ProductItem
//                 key={index}
//                 id={item._id}
//                 name={item.name}
//                 image={item.image[0]}
//                 price={item.price}
//               />
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Collection;  




import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import axios from "axios";
import { backendUrl } from "../App";

const Collection = () => {
  const { products, search, showSearch, loading } = useContext(ShopContext);
  const location = useLocation();
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  
  // Dynamic filters from API
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // Fetch categories and subcategories from API
  const fetchFilters = async () => {
    try {
      const [catRes, subRes] = await Promise.all([
        axios.get(`${backendUrl}/api/product/categories`),
        axios.get(`${backendUrl}/api/product/subcategories`),
      ]);
      setCategories(catRes.data.data);
      setSubCategories(subRes.data.data);
    } catch (error) {
      console.error("Failed to fetch filters:", error);
    }
  };

  // Fetch filters on component mount
  useEffect(() => {
    fetchFilters();
  }, []);

  // Handle incoming navigation state from Category page
  useEffect(() => {
    if (location.state) {
      const { selectedCategory, selectedSubCategory } = location.state;
      
      console.log('Received navigation state:', { selectedCategory, selectedSubCategory });
      
      if (selectedCategory) {
        setCategory([selectedCategory]);
        setShowFilter(true);
      }
      
      if (selectedSubCategory) {
        setSubCategory([selectedSubCategory]);
        setShowFilter(true);
      }

      // Clear the location state after a short delay to ensure state is set
      setTimeout(() => {
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location.state]);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col gap-1 pt-10 border-t sm:flex-row sm:gap-10">
      {/* Filter Options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="flex items-center gap-2 my-2 text-xl cursor-pointer"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt="Dropdown"
          />
        </p>
        
        {/* Dynamic Category Filters */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {categories.map((cat) => (
              <label key={cat._id} className="flex gap-2 cursor-pointer">
                <input
                  className="w-3"
                  type="checkbox"
                  value={cat.name}
                  onChange={toggleCategory}
                  checked={category.includes(cat.name)}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>
        
        {/* Dynamic Sub Category Filters */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {subCategories.map((sub) => (
              <label key={sub._id} className="flex gap-2 cursor-pointer">
                <input
                  className="w-3"
                  type="checkbox"
                  value={sub.name}
                  onChange={toggleSubCategory}
                  checked={subCategory.includes(sub.name)}
                />
                {sub.name}
              </label>
            ))}
          </div>
        </div>
        
        {/* Clear Filters Button */}
        <button
          className={`px-4 py-2 mt-1 text-white bg-black rounded hover:bg-gray-900 ${
            showFilter ? "block" : "hidden"
          } sm:block`}
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>

      {/* View Product Items */}
      <div className="flex-1">
        <div className="flex justify-between mb-4 text-base sm:text-2xl">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          {/* Product Sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="px-2 text-sm border-2 border-gray-300"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 gap-y-6">
          {loading ? (
            // show loading skeletons
            Array(8)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="h-64 bg-gray-200 animate-pulse rounded-xl"
                ></div>
              ))
          ) : (
            filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                id={item._id}
                name={item.name}
                image={item.image[0]}
                price={item.price}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;