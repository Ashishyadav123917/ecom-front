import React, { useEffect, useState } from "react";
import Title from "./Title";

const TopSeller = () => {
  const [topSellers, setTopSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    fetchTopSellers();
  }, []);

  const fetchTopSellers = async () => {
    try {
      setLoading(true);

      // Fetch orders and products
      const [ordersRes, productsRes] = await Promise.all([
        fetch(`${backendUrl}/api/order/all`),
        fetch(`${backendUrl}/api/product/list`)
      ]);

      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();

      if (ordersData.success && productsData.success) {
        calculateTopSellers(ordersData.orders, productsData.products);
      }
    } catch (error) {
      console.error("Error fetching top sellers:", error);
      setTopSellers([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTopSellers = (orders, products) => {
    const productSales = {};

    // Calculate sales for each product
    orders.forEach(order => {
      order.items?.forEach(item => {
        const productId = item.productId?._id || item.productId;
        if (productId) {
          if (!productSales[productId]) {
            productSales[productId] = {
              productId,
              quantity: 0,
              revenue: 0
            };
          }
          productSales[productId].quantity += item.quantity || 0;
          productSales[productId].revenue += (item.price || 0) * (item.quantity || 0);
        }
      });
    });

    // Match with product details and sort by revenue
    const topSellerProducts = Object.values(productSales)
      .map(sale => {
        const product = products.find(p => p._id === sale.productId);
        return product ? { ...product, soldQuantity: sale.quantity, totalRevenue: sale.revenue } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10); // Top 10 sellers

    setTopSellers(topSellerProducts);
  };


  // Simple ProductItem Component (replace with your actual ProductItem component)
  const ProductItem = ({ id, name, image, price, soldQuantity }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
      <div className="relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-800 truncate mb-2">{name}</h3>
        <p className="text-lg font-bold text-gray-900">₹{price.toLocaleString()}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="my-10">
        <div className="py-8 text-3xl text-center">
          <Title text1={"TOP"} text2={"SELLERS"} />
          <p className="w-3/4 m-auto text-xs text-gray-600 sm:text-sm md:text-base">
            Loading our most popular products...
          </p>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-10">
      <div className="py-8 text-3xl text-center">
        <Title text1={"TOP"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs text-gray-600 sm:text-sm md:text-base">
          Our top sellers are the most popular items that customers love! 
          These products have the highest sales and rave reviews.
        </p>
      </div>

      {/* Top Seller Products */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
        {topSellers.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-10">
            No top sellers found yet. Start making sales!
          </p>
        ) : (
          topSellers.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              image={Array.isArray(item.image) ? item.image[0] : item.image}
              price={item.price}
              soldQuantity={item.soldQuantity}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TopSeller;