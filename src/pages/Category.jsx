// import React, { useContext, useEffect, useState } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import Title from '../components/Title';

// const Category = () => {
//   const { products, loading } = useContext(ShopContext);
//   const [categories, setCategories] = useState([]);
//   const [activeCategory, setActiveCategory] = useState(null);

//   useEffect(() => {
//     if (products?.length) {
//       const categoryMap = products.reduce((acc, product) => {
//         if (!acc[product.category]) {
//           acc[product.category] = {
//             name: product.category,
//             count: 0,
//             image: product.image[0],
//             subCategories: new Set()
//           };
//         }
//         acc[product.category].count++;
//         product.subCategory && acc[product.category].subCategories.add(product.subCategory);
//         return acc;
//       }, {});

//       setCategories(Object.values(categoryMap).map(cat => ({
//         ...cat,
//         subCategories: Array.from(cat.subCategories)
//       })));
//     }
//   }, [products]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
//       {/* Hero Header */}
//       <div className="relative overflow-hidden bg-black text-white py-24">
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
//         </div>
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
//           <Title text1="BROWSE" text2="CATEGORIES" />
//           <div className="mt-6 flex items-center justify-center gap-4">
//             <div className="h-px w-20 bg-white/30"></div>
//             <p className="text-sm tracking-widest text-gray-300">CURATED COLLECTIONS</p>
//             <div className="h-px w-20 bg-white/30"></div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
//         {loading ? (
//           <div className="space-y-8">
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="flex flex-col md:flex-row gap-6 h-64">
//                 <div className="w-full md:w-2/5 bg-gray-200 animate-pulse"></div>
//                 <div className="flex-1 space-y-4">
//                   <div className="h-8 bg-gray-200 w-1/3 animate-pulse"></div>
//                   <div className="h-4 bg-gray-200 w-1/4 animate-pulse"></div>
//                   <div className="flex gap-2">
//                     <div className="h-8 w-20 bg-gray-200 animate-pulse"></div>
//                     <div className="h-8 w-20 bg-gray-200 animate-pulse"></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : categories.length > 0 ? (
//           <div className="space-y-12">
//             {categories.map((category, idx) => (
//               <div
//                 key={idx}
//                 onMouseEnter={() => setActiveCategory(idx)}
//                 onMouseLeave={() => setActiveCategory(null)}
//                 onClick={() => console.log('Navigate to:', category.name)}
//                 className={`group cursor-pointer transition-all duration-500 ${
//                   idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
//                 } flex flex-col md:flex-row gap-8 items-center`}
//               >
//                 {/* Image Section */}
//                 <div className="relative w-full md:w-1/2 h-96 overflow-hidden bg-black">
//                   <img
//                     src={category.image}
//                     alt={category.name}
//                     className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
//                   />
//                   <div className="absolute inset-0 border-4 border-white opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                  
//                   {/* Floating Badge */}
//                   <div className="absolute top-6 right-6 bg-white text-black px-6 py-3 font-bold transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
//                     <span className="text-2xl">{category.count}</span>
//                     <span className="text-xs block">PRODUCTS</span>
//                   </div>
//                 </div>

//                 {/* Content Section */}
//                 <div className="w-full md:w-1/2 space-y-6">
//                   <div>
//                     <h2 className="text-5xl font-bold tracking-tight mb-3 group-hover:translate-x-4 transition-transform duration-500">
//                       {category.name}
//                     </h2>
//                     <div className="h-1 w-24 bg-black transition-all duration-500 group-hover:w-40"></div>
//                   </div>

//                   <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
//                     Discover our exclusive collection of {category.count} premium {category.name.toLowerCase()} items, 
//                     carefully curated for the modern wardrobe.
//                   </p>

//                   {/* Subcategories */}
//                   {category.subCategories.length > 0 && (
//                     <div className="space-y-3">
//                       <p className="text-sm font-semibold text-gray-500 tracking-wider">AVAILABLE STYLES</p>
//                       <div className="flex flex-wrap gap-3">
//                         {category.subCategories.map((sub, subIdx) => (
//                           <span
//                             key={subIdx}
//                             className="px-4 py-2 bg-gray-100 hover:bg-black hover:text-white transition-colors duration-300 text-sm font-semibold border border-gray-300"
//                           >
//                             {sub}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Action Button */}
//                   <button className="group/btn mt-6 px-10 py-4 bg-black text-white font-bold tracking-wider hover:bg-white hover:text-black border-2 border-black transition-all duration-300 flex items-center gap-3">
//                     EXPLORE COLLECTION
//                     <svg 
//                       className="w-5 h-5 transform group-hover/btn:translate-x-2 transition-transform duration-300" 
//                       fill="none" 
//                       stroke="currentColor" 
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             ))}

//             {/* CTA Section */}
//             <div className="mt-24 relative overflow-hidden">
//               <div className="bg-black text-white py-20 px-8 md:px-16 text-center relative">
//                 <div className="absolute inset-0 opacity-5">
//                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:40px_40px]"></div>
//                 </div>
//                 <div className="relative max-w-3xl mx-auto space-y-8">
//                   <h3 className="text-4xl md:text-5xl font-bold tracking-tight">
//                     Ready to Transform Your Style?
//                   </h3>
//                   <p className="text-gray-300 text-lg leading-relaxed">
//                     Explore our handpicked categories designed to elevate your wardrobe 
//                     with sophistication and timeless elegance.
//                   </p>
//                   <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
//                     <button className="px-10 py-4 bg-white text-black font-bold tracking-wider hover:bg-gray-200 transition">
//                       SHOP ALL PRODUCTS
//                     </button>
//                     <button className="px-10 py-4 border-2 border-white text-white font-bold tracking-wider hover:bg-white hover:text-black transition">
//                       VIEW LOOKBOOK
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center py-32">
//             <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
//               <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//               </svg>
//             </div>
//             <h3 className="text-3xl font-bold text-gray-400 mb-3">No Categories Available</h3>
//             <p className="text-gray-400 text-lg">Check back later for new collections</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Category;


import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';

const Category = () => {
  const { products, loading } = useContext(ShopContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    if (products?.length) {
      const categoryMap = products.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = {
            name: product.category,
            count: 0,
            image: product.image[0],
            subCategories: new Set()
          };
        }
        acc[product.category].count++;
        product.subCategory && acc[product.category].subCategories.add(product.subCategory);
        return acc;
      }, {});

      setCategories(Object.values(categoryMap).map(cat => ({
        ...cat,
        subCategories: Array.from(cat.subCategories)
      })));
    }
  }, [products]);

  // Navigate to collection page with category filter
  const handleCategoryClick = (categoryName) => {
    navigate('/collection', { state: { selectedCategory: categoryName } });
  };

  // Navigate to collection page with subcategory filter
  const handleSubCategoryClick = (e, categoryName, subCategoryName) => {
    e.stopPropagation(); // Prevent triggering parent category click
    navigate('/collection', { 
      state: { 
        selectedCategory: categoryName,
        selectedSubCategory: subCategoryName 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-black text-white py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <Title text1="BROWSE" text2="CATEGORIES" />
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-white/30"></div>
            <p className="text-sm tracking-widest text-gray-300">CURATED COLLECTIONS</p>
            <div className="h-px w-20 bg-white/30"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
        {loading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-6 h-64">
                <div className="w-full md:w-2/5 bg-gray-200 animate-pulse"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-200 w-1/3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 w-1/4 animate-pulse"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-20 bg-gray-200 animate-pulse"></div>
                    <div className="h-8 w-20 bg-gray-200 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="space-y-12">
            {categories.map((category, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setActiveCategory(idx)}
                onMouseLeave={() => setActiveCategory(null)}
                onClick={() => handleCategoryClick(category.name)}
                className={`group cursor-pointer transition-all duration-500 ${
                  idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex flex-col md:flex-row gap-8 items-center`}
              >
                {/* Image Section */}
                <div className="relative w-full md:w-1/2 h-96 overflow-hidden bg-black">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75"
                  />
                  <div className="absolute inset-0 border-4 border-white opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                  
                  {/* Floating Badge */}
                  <div className="absolute top-6 right-6 bg-white text-black px-6 py-3 font-bold transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                    <span className="text-2xl">{category.count}</span>
                    <span className="text-xs block">PRODUCTS</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 space-y-6">
                  <div>
                    <h2 className="text-5xl font-bold tracking-tight mb-3 group-hover:translate-x-4 transition-transform duration-500">
                      {category.name}
                    </h2>
                    <div className="h-1 w-24 bg-black transition-all duration-500 group-hover:w-40"></div>
                  </div>

                  <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
                    Discover our exclusive collection of {category.count} premium {category.name.toLowerCase()} items, 
                    carefully curated for the modern wardrobe.
                  </p>

                  {/* Subcategories */}
                  {category.subCategories.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-gray-500 tracking-wider">AVAILABLE STYLES</p>
                      <div className="flex flex-wrap gap-3">
                        {category.subCategories.map((sub, subIdx) => (
                          <span
                            key={subIdx}
                            onClick={(e) => handleSubCategoryClick(e, category.name, sub)}
                            className="px-4 py-2 bg-gray-100 hover:bg-black hover:text-white transition-colors duration-300 text-sm font-semibold border border-gray-300 cursor-pointer"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category.name);
                    }}
                    className="group/btn mt-6 px-10 py-4 bg-black text-white font-bold tracking-wider hover:bg-white hover:text-black border-2 border-black transition-all duration-300 flex items-center gap-3"
                  >
                    EXPLORE COLLECTION
                    <svg 
                      className="w-5 h-5 transform group-hover/btn:translate-x-2 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {/* CTA Section */}
            <div className="mt-24 relative overflow-hidden">
              <div className="bg-black text-white py-20 px-8 md:px-16 text-center relative">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:40px_40px]"></div>
                </div>
                <div className="relative max-w-3xl mx-auto space-y-8">
                  <h3 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Ready to Transform Your Style?
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Explore our handpicked categories designed to elevate your wardrobe 
                    with sophistication and timeless elegance.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                    <button 
                      onClick={() => navigate('/collection')}
                      className="px-10 py-4 bg-white text-black font-bold tracking-wider hover:bg-gray-200 transition"
                    >
                      SHOP ALL PRODUCTS
                    </button>
                    <button className="px-10 py-4 border-2 border-white text-white font-bold tracking-wider hover:bg-white hover:text-black transition">
                      VIEW LOOKBOOK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-400 mb-3">No Categories Available</h3>
            <p className="text-gray-400 text-lg">Check back later for new collections</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;