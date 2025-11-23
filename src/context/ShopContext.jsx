
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  
  const navigate = useNavigate();

  const currency = "RS";
  const delivery_fee = 10;

  // const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    //const backendUrl = "https://mern-ecome.onrender.com"|| "http://localhost:4000";
    const backendUrl = "http://localhost:4000";
  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/list`);
      
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user addresses
  const fetchAddresses = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      setLoadingAddresses(true);
      const response = await axios.get(`${backendUrl}/api/address/${userId}`);
      
      if (response.data.success) {
        setAddresses(response.data.addresses);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Add new address
  const addAddress = async (addressData) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("Please login first");
        return false;
      }

      const response = await axios.post(`${backendUrl}/api/address/add`, {
        userId,
        addressData,
      });

      if (response.data.success) {
        setAddresses(response.data.addresses);
        toast.success("Address added successfully");
        return true;
      } else {
        toast.error(response.data.message || "Failed to add address");
        return false;
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Error adding address");
      return false;
    }
  };

  // Update address
  const updateAddress = async (addressId, addressData) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("Please login first");
        return false;
      }

      const response = await axios.put(`${backendUrl}/api/address/update`, {
        userId,
        addressId,
        addressData,
      });

      if (response.data.success) {
        setAddresses(response.data.addresses);
        toast.success("Address updated successfully");
        return true;
      } else {
        toast.error(response.data.message || "Failed to update address");
        return false;
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Error updating address");
      return false;
    }
  };

  // Delete address
  const deleteAddress = async (addressId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("Please login first");
        return false;
      }

      const response = await axios.delete(`${backendUrl}/api/address/delete`, {
        data: { userId, addressId },
      });

      if (response.data.success) {
        setAddresses(response.data.addresses);
        toast.success("Address deleted successfully");
        return true;
      } else {
        toast.error(response.data.message || "Failed to delete address");
        return false;
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Error deleting address");
      return false;
    }
  };

  // Set default address
  const setDefaultAddress = async (addressId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("Please login first");
        return false;
      }

      const response = await axios.put(`${backendUrl}/api/address/set-default`, {
        userId,
        addressId,
      });

      if (response.data.success) {
        setAddresses(response.data.addresses);
        toast.success("Default address updated");
        return true;
      } else {
        toast.error(response.data.message || "Failed to set default address");
        return false;
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Error setting default address");
      return false;
    }
  };

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch addresses when user logs in
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchAddresses();
    }
  }, []);

  // Load cart items from localStorage
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      try {
        setCartItems(JSON.parse(storedCartItems));
      } catch (error) {
        console.error("Error parsing cart items:", error);
        setCartItems({});
      }
    }
  }, []);

  // Save cart items to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(cartItems).length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Add to cart
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please Select a Size");
      return;
    }
    
    toast.success("Item Added To The Cart");

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
  };

  // Get cart count
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.error("Error calculating cart count:", error);
        }
      }
    }
    return totalCount;
  };

  // Update quantity
  const updateQuantity = async (itemId, size, quantity) => {
    if (quantity === 0) {
      toast.success("Item Removed From The Cart");
    }

    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
  };

  // Get cart amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (itemInfo) {
        for (const item in cartItems[items]) {
          try {
            if (cartItems[items][item] > 0) {
              totalAmount += itemInfo.price * cartItems[items][item];
            }
          } catch (error) {
            console.error("Error calculating cart amount:", error);
          }
        }
      }
    }
    return totalAmount;
  };

  // Clear cart
  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem("cartItems");
  };



// Updated placeOrder function in ShopContext.jsx
const placeOrder = async (orderData) => {
  try {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    // Prepare items array
    const items = [];
    for (const productId in cartItems) {
      const product = products.find(p => p._id === productId);
      if (!product) continue;

      for (const size in cartItems[productId]) {
        if (cartItems[productId][size] > 0) {
          items.push({
            productId: productId,
            quantity: cartItems[productId][size],
            size: size,
            price: product.price
          });
        }
      }
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const subTotal = getCartAmount();
    const actualDeliveryCharge = orderData.courierDetails?.deliveryCharge || 0;
    const totalAmount = subTotal + actualDeliveryCharge;

    const orderPayload = {
      userId,
      items,
      totalAmount,
      subTotal,  
      deliveryInfo: orderData.deliveryInfo,
      paymentMethod: orderData.paymentMethod || "cod",
      deliveryCharge: actualDeliveryCharge,
      courierName: orderData.courierDetails?.courierName || null,
      courierId: orderData.courierDetails?.courierId || null,
      estimatedDelivery: orderData.courierDetails?.estimatedDays || null,
      shippingId: null,
      trackingUrl: null,
      shippingDetails: orderData.shippingDetails || {},
      boxRecommendation: orderData.boxRecommendation || null,
      date: Date.now()
    };

    console.log("📦 Order Payload:", {
      method: orderPayload.paymentMethod,
      total: orderPayload.totalAmount,
      deliveryCharge: orderPayload.deliveryCharge
    });

    // 🎯 RAZORPAY PAYMENT FLOW
    if (orderData.paymentMethod === "razorpay") {
      console.log("💳 Starting Razorpay payment flow...");
      await initiateRazorpayPayment(orderPayload);
      return;
    }

    // 💰 COD/STRIPE FLOW
    console.log("📮 Starting COD/Stripe order flow...");
    const response = await axios.post(`${backendUrl}/api/order/add`, orderPayload);

    if (response.data.success) {
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/orders");
    } else {
      toast.error(response.data.message || "Failed to place order");
    }
  } catch (error) {
    console.error("Error placing order:", error);
    toast.error(error.response?.data?.message || "Error placing order");
  }
};










// const placeOrder = async (orderData) => {
//   try {
//     const userId = localStorage.getItem("userId");

//     if (!userId) {
//       toast.error("Please login to place an order");
//       navigate("/login");
//       return;
//     }

//     // Prepare items array and collect shipping details from products
//     const items = [];
//     let totalWeight = 0;
//     let maxLength = 0;
//     let maxBreadth = 0;
//     let maxHeight = 0;
//     let totalDeclaredValue = 0;
//     let hasCOD = false;
//     let shippingMode = "Surface";

//     for (const productId in cartItems) {
//       // Find the product from products array
//       const product = products.find(p => p._id === productId);
      
//       if (!product) {
//         console.error(`Product ${productId} not found`);
//         continue;
//       }

//       for (const size in cartItems[productId]) {
//         if (cartItems[productId][size] > 0) {
//           const quantity = cartItems[productId][size];
          
//           // ✅ FIXED: Added price field to each item
//           items.push({
//             productId: productId,
//             quantity: quantity,
//             size: size,
//             price: product.price // Added price field
//           });

//           // Aggregate shipping details from each product
//           totalWeight += (product.weight || 1) * quantity;
//           maxLength = Math.max(maxLength, product.length || 15);
//           maxBreadth = Math.max(maxBreadth, product.breadth || 10);
//           maxHeight = Math.max(maxHeight, product.height || 5);
//           totalDeclaredValue += (product.declared_value || product.price) * quantity;
          
//           // If any product has COD enabled, set hasCOD to true
//           if (product.cod) {
//             hasCOD = true;
//           }
          
//           // Use Air mode if any product requires it
//           if (product.mode === "Air") {
//             shippingMode = "Air";
//           }
//         }
//       }
//     }

//     if (items.length === 0) {
//       toast.error("Your cart is empty");
//       return;
//     }

//     const subTotal = getCartAmount();
//     const actualDeliveryCharge = orderData.courierDetails?.deliveryCharge || delivery_fee;
//     const totalAmount = subTotal + actualDeliveryCharge;

//     // Get selected address
//     const selectedAddress = orderData.deliveryInfo;

//     // Prepare shipping details
//     const shippingDetails = {
//       pickup_postcode: orderData.shippingDetails?.pickup_postcode || "400001",
//       delivery_postcode: selectedAddress.zipCode,
//       weight: totalWeight,
//       cod: (orderData.paymentMethod === "cod" && hasCOD) ? 1 : 0,
//       length: maxLength,
//       breadth: maxBreadth,
//       height: maxHeight,
//       declared_value: totalDeclaredValue,
//       mode: shippingMode,
//     };

//     // ✅ FIXED: Added date field and courier details
//     const orderPayload = {
//       userId,
//       items,
//       totalAmount,
//       subTotal,  
//       deliveryInfo: selectedAddress,
//       paymentMethod: orderData.paymentMethod || "cod",
//       deliveryCharge: actualDeliveryCharge,
//       courierName: orderData.courierDetails?.courierName || null,
//       courierId: orderData.courierDetails?.courierId || null,
//       estimatedDelivery: orderData.courierDetails?.estimatedDays || null,
//       shippingId: null,
//       trackingUrl: null,
//       shippingDetails: shippingDetails,
//       date: Date.now()
//     };

//     console.log("Order Payload being sent:", orderPayload);

//     console.log("Order Payload with shipping details:", orderPayload);

//     const response = await axios.post(`${backendUrl}/api/order/add`, orderPayload);

//     if (response.data.success) {
//       toast.success("Order placed successfully!");
//       clearCart();
//       navigate("/orders");
//     } else {
//       toast.error(response.data.message || "Failed to place order");
//     }
//   } catch (error) {
//     console.error("Error placing order:", error);
//     console.error("Error response:", error.response?.data);
//     toast.error(error.response?.data?.message || "Error placing order");
//   }
// };





  


// const placeOrder = async (orderData) => {
//   try {
//     const userId = localStorage.getItem("userId");

//     if (!userId) {
//       toast.error("Please login to place an order");
//       navigate("/login");
//       return;
//     }

//     // Prepare items array and collect shipping details from products
//     const items = [];
//     let totalWeight = 0;
//     let maxLength = 0;
//     let maxBreadth = 0;
//     let maxHeight = 0;
//     let totalDeclaredValue = 0;
//     let hasCOD = false;
//     let shippingMode = "Surface";

//     for (const productId in cartItems) {
//       // Find the product from products array
//       const product = products.find(p => p._id === productId);
      
//       if (!product) {
//         console.error(`Product ${productId} not found`);
//         continue;
//       }

//       for (const size in cartItems[productId]) {
//         if (cartItems[productId][size] > 0) {
//           const quantity = cartItems[productId][size];
          
//           // ✅ FIXED: Added price field to each item
//           items.push({
//             productId: productId,
//             quantity: quantity,
//             size: size,
//             price: product.price // Added price field
//           });

//           // Aggregate shipping details from each product
//           totalWeight += (product.weight || 1) * quantity;
//           maxLength = Math.max(maxLength, product.length || 15);
//           maxBreadth = Math.max(maxBreadth, product.breadth || 10);
//           maxHeight = Math.max(maxHeight, product.height || 5);
//           totalDeclaredValue += (product.declared_value || product.price) * quantity;
          
//           // If any product has COD enabled, set hasCOD to true
//           if (product.cod) {
//             hasCOD = true;
//           }
          
//           // Use Air mode if any product requires it
//           if (product.mode === "Air") {
//             shippingMode = "Air";
//           }
//         }
//       }
//     }

//     if (items.length === 0) {
//       toast.error("Your cart is empty");
//       return;
//     }

//     const subTotal = getCartAmount();
//     const actualDeliveryCharge = orderData.courierDetails?.deliveryCharge || delivery_fee;
//     const totalAmount = subTotal + actualDeliveryCharge;

//     // Get selected address
//     const selectedAddress = orderData.deliveryInfo;

//     // Prepare shipping details
//     const shippingDetails = {
//       pickup_postcode: orderData.shippingDetails?.pickup_postcode || "400001",
//       delivery_postcode: selectedAddress.zipCode,
//       weight: totalWeight,
//       cod: (orderData.paymentMethod === "cod" && hasCOD) ? 1 : 0,
//       length: maxLength,
//       breadth: maxBreadth,
//       height: maxHeight,
//       declared_value: totalDeclaredValue,
//       mode: shippingMode,
//     };

//     // ✅ FIXED: Added date field and courier details
//     const orderPayload = {
//       userId,
//       items,
//       totalAmount,
//       subTotal,  
//       deliveryInfo: selectedAddress,
//       paymentMethod: orderData.paymentMethod || "cod",
//       deliveryCharge: actualDeliveryCharge,
//       courierName: orderData.courierDetails?.courierName || null,
//       courierId: orderData.courierDetails?.courierId || null,
//       estimatedDelivery: orderData.courierDetails?.estimatedDays || null,
//       shippingId: null,
//       trackingUrl: null,
//       shippingDetails: shippingDetails,
//       date: Date.now()
//     };

//     console.log("Order Payload being sent:", orderPayload);

//     console.log("Order Payload with shipping details:", orderPayload);

//     const response = await axios.post(`${backendUrl}/api/order/add`, orderPayload);

//     if (response.data.success) {
//       toast.success("Order placed successfully!");
//       clearCart();
//       navigate("/orders");
//     } else {
//       toast.error(response.data.message || "Failed to place order");
//     }
//   } catch (error) {
//     console.error("Error placing order:", error);
//     console.error("Error response:", error.response?.data);
//     toast.error(error.response?.data?.message || "Error placing order");
//   }
// };






// this is the last ont that use
// const placeOrder = async (orderData) => {
//   try {
//     const userId = localStorage.getItem("userId");

//     if (!userId) {
//       toast.error("Please login to place an order");
//       navigate("/login");
//       return;
//     }

//     // Prepare items array and collect shipping details from products
//     const items = [];
//     let totalWeight = 0;
//     let maxLength = 0;
//     let maxBreadth = 0;
//     let maxHeight = 0;
//     let totalDeclaredValue = 0;
//     let hasCOD = false;
//     let shippingMode = "Surface";

//     for (const productId in cartItems) {
//       // Find the product from products array
//       const product = products.find(p => p._id === productId);
      
//       if (!product) {
//         console.error(`Product ${productId} not found`);
//         continue;
//       }

//       for (const size in cartItems[productId]) {
//         if (cartItems[productId][size] > 0) {
//           const quantity = cartItems[productId][size];
          
//           // ✅ FIXED: Added price field to each item
//           items.push({
//             productId: productId,
//             quantity: quantity,
//             size: size,
//             price: product.price // Added price field
//           });

//           // Aggregate shipping details from each product
//           totalWeight += (product.weight || 1) * quantity;
//           maxLength = Math.max(maxLength, product.length || 15);
//           maxBreadth = Math.max(maxBreadth, product.breadth || 10);
//           maxHeight = Math.max(maxHeight, product.height || 5);
//           totalDeclaredValue += (product.declared_value || product.price) * quantity;
          
//           // If any product has COD enabled, set hasCOD to true
//           if (product.cod) {
//             hasCOD = true;
//           }
          
//           // Use Air mode if any product requires it
//           if (product.mode === "Air") {
//             shippingMode = "Air";
//           }
//         }
//       }
//     }

//     if (items.length === 0) {
//       toast.error("Your cart is empty");
//       return;
//     }

//     const subTotal = getCartAmount();
//     const totalAmount = getCartAmount() + delivery_fee;

//     // Get selected address
//     const selectedAddress = orderData.deliveryInfo;

//     // Prepare shipping details
//     const shippingDetails = {
//       pickup_postcode: orderData.shippingDetails?.pickup_postcode || "400001",
//       delivery_postcode: selectedAddress.zipCode,
//       weight: totalWeight,
//       cod: (orderData.paymentMethod === "cod" && hasCOD) ? 1 : 0,
//       length: maxLength,
//       breadth: maxBreadth,
//       height: maxHeight,
//       declared_value: totalDeclaredValue,
//       mode: shippingMode,
//     };

//     // ✅ FIXED: Added date field
//     const orderPayload = {
//       userId,
//       items,
//       totalAmount,
//       subTotal,  
//       deliveryInfo: selectedAddress,
//       paymentMethod: orderData.paymentMethod || "cod",
//       deliveryCharge: orderData.courierDetails?.deliveryCharge || delivery_fee,
//       courierName: orderData.courierDetails?.courierName || null,
//       courierId: orderData.courierDetails?.courierId || null,
//       estimatedDelivery: orderData.courierDetails?.estimatedDays || null,
//       shippingId: null,
//       trackingUrl: null,
//       shippingDetails: shippingDetails,
//       date: Date.now()
//     };

//     console.log("Order Payload with shipping details:", orderPayload);

//     const response = await axios.post(`${backendUrl}/api/order/add`, orderPayload);

//     if (response.data.success) {
//       toast.success("Order placed successfully!");
//       clearCart();
//       navigate("/orders");
//     } else {
//       toast.error(response.data.message || "Failed to place order");
//     }
//   } catch (error) {
//     console.error("Error placing order:", error);
//     console.error("Error response:", error.response?.data);
//     toast.error(error.response?.data?.message || "Error placing order");
//   }
// };








// const placeOrder = async (orderData) => {
//   try {
//     const userId = localStorage.getItem("userId");

//     if (!userId) {
//       toast.error("Please login to place an order");
//       navigate("/login");
//       return;
//     }

//     // Prepare items array and collect shipping details from products
//     const items = [];
//     let totalWeight = 0;
//     let maxLength = 0;
//     let maxBreadth = 0;
//     let maxHeight = 0;
//     let totalDeclaredValue = 0;
//     let hasCOD = false;
//     let shippingMode = "Surface";

//     for (const productId in cartItems) {
//       // Find the product from products array
//       const product = products.find(p => p._id === productId);
      
//       if (!product) {
//         console.error(`Product ${productId} not found`);
//         continue;
//       }

//       for (const size in cartItems[productId]) {
//         if (cartItems[productId][size] > 0) {
//           const quantity = cartItems[productId][size];
          
//           // ✅ FIXED: Added price field to each item
//           items.push({
//             productId: productId,
//             quantity: quantity,
//             size: size,
//             price: product.price // Added price field
//           });

//           // Aggregate shipping details from each product
//           totalWeight += (product.weight || 1) * quantity;
//           maxLength = Math.max(maxLength, product.length || 15);
//           maxBreadth = Math.max(maxBreadth, product.breadth || 10);
//           maxHeight = Math.max(maxHeight, product.height || 5);
//           totalDeclaredValue += (product.declared_value || product.price) * quantity;
          
//           // If any product has COD enabled, set hasCOD to true
//           if (product.cod) {
//             hasCOD = true;
//           }
          
//           // Use Air mode if any product requires it
//           if (product.mode === "Air") {
//             shippingMode = "Air";
//           }
//         }
//       }
//     }

//     if (items.length === 0) {
//       toast.error("Your cart is empty");
//       return;
//     }

//     const subTotal = getCartAmount();
//     const totalAmount = getCartAmount() + delivery_fee;

//     // Get selected address
//     const selectedAddress = orderData.deliveryInfo;

//     // Prepare shipping details
//     const shippingDetails = {
//       pickup_postcode: orderData.shippingDetails?.pickup_postcode || "400001",
//       delivery_postcode: selectedAddress.zipCode,
//       weight: totalWeight,
//       cod: (orderData.paymentMethod === "cod" && hasCOD) ? 1 : 0,
//       length: maxLength,
//       breadth: maxBreadth,
//       height: maxHeight,
//       declared_value: totalDeclaredValue,
//       mode: shippingMode,
//     };

//     // ✅ FIXED: Added date field
//     const orderPayload = {
//       userId,
//       items,
//       totalAmount,
//       subTotal,  
//       deliveryInfo: selectedAddress,
//       paymentMethod: orderData.paymentMethod || "cod",
//       deliveryCharge: delivery_fee,
//       courierName: null,
//       shippingId: null,
//       trackingUrl: null,
//       shippingDetails: shippingDetails,
//       date: Date.now() // Added date field
//     };

//     console.log("Order Payload with shipping details:", orderPayload);

//     const response = await axios.post(`${backendUrl}/api/order/add`, orderPayload);

//     if (response.data.success) {
//       toast.success("Order placed successfully!");
//       clearCart();
//       navigate("/orders");
//     } else {
//       toast.error(response.data.message || "Failed to place order");
//     }
//   } catch (error) {
//     console.error("Error placing order:", error);
//     console.error("Error response:", error.response?.data);
//     toast.error(error.response?.data?.message || "Error placing order");
//   }
// };



// Add these new functions to your ShopContext.jsx

// Fetch available courier services and rates
const fetchDeliveryRates = async (deliveryPincode, orderDetails) => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Please login first");
      return null;
    }

    // Calculate total weight and dimensions from cart
    let totalWeight = 0;
    let maxLength = 0;
    let maxBreadth = 0;
    let maxHeight = 0;
    let totalDeclaredValue = 0;
    let hasCOD = false;

    for (const productId in cartItems) {
      const product = products.find(p => p._id === productId);
      if (!product) continue;

      for (const size in cartItems[productId]) {
        if (cartItems[productId][size] > 0) {
          const quantity = cartItems[productId][size];
          totalWeight += (product.weight || 1) * quantity;
          maxLength = Math.max(maxLength, product.length || 15);
          maxBreadth = Math.max(maxBreadth, product.breadth || 10);
          maxHeight = Math.max(maxHeight, product.height || 5);
          totalDeclaredValue += (product.declared_value || product.price) * quantity;
          if (product.cod) hasCOD = true;
        }
      }
    }

    const requestData = {
      pickup_postcode: orderDetails?.pickup_postcode || "400001",
      delivery_postcode: deliveryPincode,
      weight: totalWeight || 1,
      cod: orderDetails?.paymentMethod === "cod" && hasCOD ? 1 : 0,
      length: maxLength || 15,
      breadth: maxBreadth || 10,
      height: maxHeight || 5,
      declared_value: totalDeclaredValue || getCartAmount(),
      mode: orderDetails?.mode || "Surface"
    };

    console.log("Fetching delivery rates with:", requestData);

    const response = await axios.post(`${backendUrl}/api/rate/get-rates`, requestData);

    if (response.data.success) {
      return response.data.couriers; // Array of available couriers
    } else {
      toast.error(response.data.message || "Failed to fetch delivery rates");
      return null;
    }
  } catch (error) {
    console.error("Error fetching delivery rates:", error);
    toast.error("Error fetching delivery rates");
    return null;
  }
};






































// 🎯 RAZORPAY PAYMENT INITIATION
const initiateRazorpayPayment = async (orderPayload) => {
  try {
    // Check if Razorpay script is loaded
    if (!window.Razorpay) {
      toast.error("Payment gateway not loaded. Please refresh the page.");
      return;
    }

    console.log("💳 Initiating Razorpay payment...");

    // Step 1: Create Razorpay order
    const orderResponse = await axios.post(`${backendUrl}/api/razorpay/create-order`, {
      amount: orderPayload.totalAmount,
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    if (!orderResponse.data.success) {
      toast.error("Failed to initialize payment");
      return;
    }

    const { order, key } = orderResponse.data;
    console.log("✅ Razorpay order created:", order.id);

    // Step 2: Initialize Razorpay checkout
    const options = {
      key: key, // Razorpay Key ID from backend
      amount: order.amount,
      currency: order.currency,
      name: "Your Store Name", // 👈 Change this to your store name
      description: "Order Payment",
      image: "/your-logo.png", // 👈 Optional: Add your logo
      order_id: order.id,
      handler: async function (response) {
        console.log("💰 Payment successful:", response);
        // Step 3: Payment successful - verify and create order
        await verifyRazorpayPayment(response, orderPayload);
      },
      prefill: {
        name: `${orderPayload.deliveryInfo.firstName} ${orderPayload.deliveryInfo.lastName}`,
        email: orderPayload.deliveryInfo.email,
        contact: orderPayload.deliveryInfo.mobile,
      },
      notes: {
        address: orderPayload.deliveryInfo.street,
      },
      theme: {
        color: "#000000", // 👈 Change to your brand color
      },
      modal: {
        ondismiss: function () {
          toast.warning("Payment cancelled");
          console.log("❌ Payment modal closed");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    
    rzp.on("payment.failed", function (response) {
      console.error("❌ Payment failed:", response.error);
      toast.error(`Payment failed: ${response.error.description}`);
      
      // Log failure to backend
      axios.post(`${backendUrl}/api/razorpay/payment-failure`, {
        razorpay_order_id: order.id,
        error: response.error,
      }).catch(err => console.error("Failed to log error:", err));
    });

    // Open Razorpay checkout
    rzp.open();
    console.log("🚀 Razorpay checkout opened");

  } catch (error) {
    console.error("Error initiating Razorpay payment:", error);
    toast.error(error.response?.data?.message || "Failed to initiate payment");
  }
};

// 🔐 VERIFY RAZORPAY PAYMENT
const verifyRazorpayPayment = async (razorpayResponse, orderPayload) => {
  try {
    console.log("🔍 Verifying payment...");
    
    const verificationResponse = await axios.post(
      `${backendUrl}/api/razorpay/verify-payment`,
      {
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
        orderData: orderPayload,
      }
    );

    if (verificationResponse.data.success) {
      console.log("✅ Payment verified and order created:", verificationResponse.data.orderId);
      toast.success("🎉 Payment successful! Order placed.");
      
      // Clear cart and navigate
      clearCart();
      navigate("/orders");
    } else {
      toast.error("Payment verification failed. Please contact support.");
      console.error("❌ Verification failed:", verificationResponse.data);
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    toast.error("Payment verification failed. Please contact support with your payment ID.");
  }
};
















// Add this useEffect in your ShopContext or main App component:
useEffect(() => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if already loaded
      if (window.Razorpay) {
        console.log("✅ Razorpay already loaded");
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        console.log("✅ Razorpay script loaded successfully");
        resolve(true);
      };
      script.onerror = () => {
        console.error("❌ Failed to load Razorpay script");
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  loadRazorpayScript();
}, []);






  const value = {
    loading,
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    fetchDeliveryRates,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    clearCart,
    placeOrder,
    navigate,
    backendUrl,
    addresses,
    loadingAddresses,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;