// import React, { useContext, useState, useEffect } from 'react';
// import Title from '../components/Title';
// import { assets } from '../assets/assets';
// import { ShopContext } from '../context/ShopContext';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { calculateBoxRecommendation, getShippingDimensions } from '../utils/boxCalculator';

// const PlaceOrder = () => {
//   const [method, setMethod] = useState('cod');
//   const { placeOrder, addresses, fetchAddresses, navigate, backendUrl, products, cartItems, getCartAmount } = useContext(ShopContext);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [availableCouriers, setAvailableCouriers] = useState([]);
//   const [selectedCourier, setSelectedCourier] = useState(null);
//   const [loadingRates, setLoadingRates] = useState(false);
//   const [deliveryCharge, setDeliveryCharge] = useState(0);
//   const [boxRecommendation, setBoxRecommendation] = useState(null);

//   // Load Razorpay script on component mount
//   useEffect(() => {
//     const loadRazorpayScript = () => {
//       return new Promise((resolve) => {
//         const script = document.createElement("script");
//         script.src = "https://checkout.razorpay.com/v1/checkout.js";
//         script.onload = () => {
//           console.log("✅ Razorpay script loaded");
//           resolve(true);
//         };
//         script.onerror = () => {
//           console.error("❌ Failed to load Razorpay script");
//           resolve(false);
//         };
//         document.body.appendChild(script);
//       });
//     };

//     loadRazorpayScript();
//   }, []);

//   useEffect(() => {
//     fetchAddresses();
//   }, []);

//   useEffect(() => {
//     const selectedAddressId = localStorage.getItem('selectedAddressId');

//     if (!selectedAddressId) {
//       toast.error("Please select a delivery address first");
//       navigate('/cart');
//       return;
//     }

//     if (addresses.length > 0) {
//       const address = addresses.find(addr => addr._id === selectedAddressId);
//       if (address) {
//         setSelectedAddress(address);
//       } else {
//         toast.error("Selected address not found");
//         navigate('/cart');
//       }
//     }
//   }, [addresses]);

//   // Calculate box recommendation when cart or products change
//   useEffect(() => {
//     if (products.length > 0 && Object.keys(cartItems).length > 0) {
//       const recommendation = calculateBoxRecommendation(cartItems, products);
//       setBoxRecommendation(recommendation);
//       console.log("Box Recommendation:", recommendation);
//     }
//   }, [cartItems, products]);

//   // 🔥 Fetch delivery rates when address, payment method, or box recommendation changes
//   useEffect(() => {
//     if (selectedAddress && selectedAddress.zipCode && boxRecommendation) {
//       fetchDeliveryRates();
//     }
//   }, [selectedAddress, method, boxRecommendation]);

//   const fetchDeliveryRates = async () => {
//     try {
//       setLoadingRates(true);

//       // Get shipping dimensions from box recommendation
//       const shippingDims = getShippingDimensions(boxRecommendation);

//       // Calculate additional parameters
//       let totalDeclaredValue = 0;
//       let hasCOD = false;
//       let shippingMode = "Surface";

//       for (const productId in cartItems) {
//         const product = products.find(p => p._id === productId);
//         if (!product) continue;

//         for (const size in cartItems[productId]) {
//           if (cartItems[productId][size] > 0) {
//             const quantity = cartItems[productId][size];
//             totalDeclaredValue += (product.declared_value || product.price) * quantity;
//             if (product.cod) hasCOD = true;
//             if (product.mode === "Air") shippingMode = "Air";
//           }
//         }
//       }

//       // 🎯 KEY CHANGE: Set COD based on payment method
//       // const codValue = method === "cod" && hasCOD ? 1 : 0;

//       const codValue = method === "cod" ? 1 : 0;

//       const requestData = {
//         pickup_postcode: "400001",
//         delivery_postcode: selectedAddress.zipCode,
//         weight: shippingDims.weight,
//         cod: codValue, // ✅ 0 for Razorpay, 1 for COD
//         length: shippingDims.length,
//         breadth: shippingDims.breadth,
//         height: shippingDims.height,
//         declared_value: totalDeclaredValue || getCartAmount(),
//         mode: shippingMode
//       };

//       console.log(`🚚 Fetching rates for ${method.toUpperCase()} (COD: ${codValue}):`, requestData);

//       const response = await axios.post(`${backendUrl}/api/rate/get-rates`, requestData);

//       if (response.data.success) {
//         setAvailableCouriers(response.data.couriers);
//         // Auto-select cheapest courier
//         if (response.data.couriers.length > 0) {
//           const cheapest = response.data.couriers[0];
//           setSelectedCourier(cheapest);
//           setDeliveryCharge(cheapest.rate);

//           console.log(`✅ ${method === 'razorpay' ? 'Razorpay' : 'COD'} rate: ₹${cheapest.rate}`);
//         }
//       } else {
//         toast.error(response.data.message || "Failed to fetch delivery rates");
//       }
//     } catch (error) {
//       console.error("Error fetching delivery rates:", error);
//       toast.error("Error fetching delivery rates");
//     } finally {
//       setLoadingRates(false);
//     }
//   };

//   const handleCourierSelect = (courier) => {
//     setSelectedCourier(courier);
//     setDeliveryCharge(courier.rate);
//   };

//   // 🎯 Handle payment method change
//   const handleMethodChange = (newMethod) => {
//     setMethod(newMethod);
//     console.log(`💳 Payment method changed to: ${newMethod.toUpperCase()}`);
//     toast.info(`Recalculating delivery charge for ${newMethod.toUpperCase()}...`);
//   };

//   const handlePlaceOrder = async () => {
//     if (!selectedAddress) {
//       toast.error("No delivery address selected");
//       navigate('/cart');
//       return;
//     }

//     if (!selectedCourier) {
//       toast.error("Please wait for delivery rates to load");
//       return;
//     }

//     if (!boxRecommendation) {
//       toast.error("Box calculation in progress");
//       return;
//     }

//     const shippingDims = getShippingDimensions(boxRecommendation);

//     const orderData = {
//       deliveryInfo: {
//         firstName: selectedAddress.firstName,
//         lastName: selectedAddress.lastName,
//         email: selectedAddress.email,
//         street: selectedAddress.street,
//         city: selectedAddress.city,
//         state: selectedAddress.state,
//         zipCode: selectedAddress.zipCode,
//         country: selectedAddress.country,
//         mobile: selectedAddress.mobile
//       },
//       paymentMethod: method,
//       shippingDetails: {
//         pickup_postcode: '400001',
//         delivery_postcode: selectedAddress.zipCode,
//         weight: shippingDims.weight,
//         length: shippingDims.length,
//         breadth: shippingDims.breadth,
//         height: shippingDims.height,
//         declared_value: getCartAmount(),
//         mode: "Surface",
//         cod: method === "cod" ? 1 : 0 // ✅ Add COD flag
//       },
//       courierDetails: {
//         courierId: selectedCourier.id,
//         courierName: selectedCourier.name,
//         deliveryCharge: selectedCourier.rate,
//         estimatedDays: selectedCourier.estimatedDays
//       },
//       boxRecommendation: boxRecommendation
//     };

//     console.log("📦 Placing order with:", {
//       method: method,
//       deliveryCharge: selectedCourier.rate,
//       courier: selectedCourier.name
//     });

//     await placeOrder(orderData);
//     localStorage.removeItem('selectedAddressId');
//   };

//   if (!selectedAddress || !boxRecommendation) {
//     return (
//       <div className='flex items-center justify-center min-h-[60vh]'>
//         <p className='text-gray-500'>Loading...</p>
//       </div>
//     );
//   }

//   const subTotal = getCartAmount();
//   const totalAmount = subTotal + deliveryCharge;

//   return (
//     <div className='flex flex-col gap-8 pt-5 border-t sm:pt-14 lg:flex-row'>
//       {/* Left Side - Delivery Info & Box Info */}
//       <div className='flex flex-col flex-1 gap-6'>
//         {/* Delivery Address */}
//         <div>
//           <div className='mb-4 text-xl sm:text-2xl'>
//             <Title text1={'DELIVERY'} text2={'INFORMATION'} />
//           </div>
//           <div className='p-4 border border-gray-300 rounded bg-gray-50'>
//             <p className='font-semibold'>
//               {selectedAddress.firstName} {selectedAddress.lastName}
//             </p>
//             <p className='text-sm text-gray-600'>{selectedAddress.street}</p>
//             <p className='text-sm text-gray-600'>
//               {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
//             </p>
//             <p className='text-sm text-gray-600'>{selectedAddress.country}</p>
//             <p className='text-sm text-gray-600'>Mobile: {selectedAddress.mobile}</p>
//             <p className='text-sm text-gray-600'>Email: {selectedAddress.email}</p>
//           </div>
//           <button
//             onClick={() => navigate('/cart')}
//             className='px-4 py-2 mt-3 text-sm border border-gray-400 rounded hover:bg-gray-50'
//           >
//             ← Change Address
//           </button>
//         </div>

//         {/* Box Recommendation Display */}
//         <div>
//           <div className='mb-4 text-xl sm:text-2xl'>
//             <Title text1={'PACKAGING'} text2={'DETAILS'} />
//           </div>
//           <div className='p-4 border rounded border-blue-300 bg-blue-50'>
//             <div className='flex items-start justify-between mb-3'>
//               <div>
//                 <p className='font-semibold text-blue-900'>
//                   Recommended Box: {boxRecommendation.recommendedBox.name}
//                 </p>
//                 <p className='text-sm text-blue-700'>
//                   Dimensions: {boxRecommendation.recommendedBox.dimensions.length} × {boxRecommendation.recommendedBox.dimensions.breadth} × {boxRecommendation.recommendedBox.dimensions.height} cm
//                 </p>
//               </div>
//               <div className='text-right'>
//                 <p className='text-sm font-medium text-blue-900'>
//                   {boxRecommendation.totalWeight} kg
//                 </p>
//                 <p className='text-xs text-blue-600'>Total Weight</p>
//               </div>
//             </div>

//             <div className='pt-3 mt-3 border-t border-blue-200'>
//               <p className='mb-2 text-xs font-semibold text-blue-800'>Items Breakdown:</p>
//               <div className='space-y-1'>
//                 {boxRecommendation.itemsList.map((item, idx) => (
//                   <div key={idx} className='flex justify-between text-xs text-blue-700'>
//                     <span>
//                       {item.name} {item.size && `(${item.size})`} × {item.quantity}
//                     </span>
//                     <span className='font-medium'>{item.totalWeight} kg</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className='pt-3 mt-3 border-t border-blue-200'>
//               <div className='flex justify-between text-xs'>
//                 <span className='text-blue-700'>Packing Efficiency:</span>
//                 <span className='font-semibold text-blue-900'>{boxRecommendation.packingEfficiency}%</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Courier Selection */}
//         <div>
//           <div className='mb-4 text-xl sm:text-2xl'>
//             <Title text1={'SELECT'} text2={'COURIER SERVICE'} />
//           </div>

//           {loadingRates ? (
//             <div className='p-8 text-center border rounded'>
//               <div className='flex flex-col items-center gap-2'>
//                 <div className='w-8 h-8 border-4 border-t-4 border-gray-200 rounded-full border-t-blue-600 animate-spin'></div>
//                 <p className='text-gray-500'>
//                   Calculating {method === 'razorpay' ? 'online payment' : 'COD'} rates...
//                 </p>
//               </div>
//             </div>
//           ) : availableCouriers.length > 0 ? (
//             <div className='flex flex-col gap-3'>
//               {availableCouriers.map((courier) => (
//                 <div
//                   key={courier.id}
//                   onClick={() => handleCourierSelect(courier)}
//                   className={`p-4 border rounded cursor-pointer transition-all ${selectedCourier?.id === courier.id
//                       ? 'border-black bg-gray-50'
//                       : 'border-gray-300 hover:border-gray-400'
//                     }`}
//                 >
//                   <div className='flex items-start justify-between'>
//                     <div className='flex items-start gap-3'>
//                       <input
//                         type="radio"
//                         checked={selectedCourier?.id === courier.id}
//                         onChange={() => handleCourierSelect(courier)}
//                         className='mt-1'
//                       />
//                       <div>
//                         <p className='font-semibold'>{courier.name}</p>
//                         <p className='text-sm text-gray-600'>
//                           Estimated Delivery: {courier.estimatedDays || 'N/A'}
//                         </p>
//                         {courier.rating && (
//                           <p className='text-xs text-gray-500'>Rating: {courier.rating}/5</p>
//                         )}
//                       </div>
//                     </div>
//                     <div className='text-right'>
//                       <p className='font-semibold text-green-600'>
//                         ₹{courier.rate.toFixed(2)}
//                       </p>
//                       {courier.cod_charges > 0 && method === 'cod' && (
//                         <p className='text-xs text-gray-500'>
//                           (includes ₹{courier.cod_charges} COD)
//                         </p>
//                       )}
//                       {method === 'razorpay' && (
//                         <p className='text-xs text-green-600'>
//                           No COD charges ✓
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className='p-8 text-center border rounded'>
//               <p className='text-gray-500'>No courier services available for this location</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Right Side - Order Summary & Payment */}
//       <div className='lg:min-w-[400px] lg:sticky lg:top-20 lg:self-start'>
//         {/* Order Summary */}
//         <div className='p-6 border rounded'>
//           <h3 className='mb-4 text-xl font-semibold'>Order Summary</h3>
//           <div className='flex justify-between mb-2'>
//             <p className='text-gray-600'>Subtotal:</p>
//             <p className='font-medium'>₹{subTotal.toFixed(2)}</p>
//           </div>
//           <div className='flex justify-between mb-2'>
//             <p className='text-gray-600'>Delivery Charge:</p>
//             <p className='font-medium text-green-600'>
//               {loadingRates ? (
//                 <span className='text-sm text-gray-400'>Calculating...</span>
//               ) : (
//                 <>
//                   ₹{deliveryCharge.toFixed(2)}
//                   {method === 'razorpay' && (
//                     <span className='block text-xs text-green-600'>No COD charges</span>
//                   )}
//                 </>
//               )}
//             </p>
//           </div>
//           <div className='pt-2 mt-2 border-t'>
//             <div className='flex justify-between'>
//               <p className='text-lg font-semibold'>Total:</p>
//               <p className='text-lg font-semibold'>₹{totalAmount.toFixed(2)}</p>
//             </div>
//           </div>
//         </div>

//         {/* Payment Methods */}
//         <div className='mt-6'>
//           <div className='mb-4 text-xl sm:text-2xl'>
//             <Title text1={'PAYMENT'} text2={'METHOD'} />
//           </div>
//           <div className='flex flex-col gap-3'>
//             <div
//               onClick={() => handleMethodChange('razorpay')}
//               className='flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50'
//             >
//               <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-600' : ''}`}></p>
//               <img className='h-5' src={assets.razorpay_logo} alt="RazorPay" />
//               <span className='ml-auto text-xs text-green-600'>No COD fee</span>
//             </div>
//             <div
//               onClick={() => handleMethodChange('cod')}
//               className='flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50'
//             >
//               <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-600' : ''}`}></p>
//               <p className='text-sm font-medium text-gray-700'>CASH ON DELIVERY</p>
//               {selectedCourier?.cod_charges > 0 && (
//                 <span className='ml-auto text-xs text-orange-600'>
//                   +₹{selectedCourier.cod_charges} fee
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Place Order Button */}
//         <button
//           onClick={handlePlaceOrder}
//           disabled={loadingRates || !selectedCourier}
//           className='w-full px-8 py-3 mt-6 text-sm text-white bg-black disabled:bg-gray-400 disabled:cursor-not-allowed active:bg-gray-800'
//         >
//           {loadingRates ? 'CALCULATING RATES...' : `PLACE ORDER - ₹${totalAmount.toFixed(2)}`}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default PlaceOrder;




import React, { useContext, useState, useEffect } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { calculateBoxRecommendation, getShippingDimensions } from '../utils/boxCalculator';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { placeOrder, addresses, fetchAddresses, navigate, backendUrl, products, cartItems, getCartAmount } = useContext(ShopContext);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [availableCouriers, setAvailableCouriers] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [boxRecommendation, setBoxRecommendation] = useState(null);

  // Load Razorpay script on component mount
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          console.log("✅ Razorpay script loaded");
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

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    const selectedAddressId = localStorage.getItem('selectedAddressId');

    if (!selectedAddressId) {
      toast.error("Please select a delivery address first");
      navigate('/cart');
      return;
    }

    if (addresses.length > 0) {
      const address = addresses.find(addr => addr._id === selectedAddressId);
      if (address) {
        setSelectedAddress(address);
      } else {
        toast.error("Selected address not found");
        navigate('/cart');
      }
    }
  }, [addresses]);

  // Calculate box recommendation when cart or products change
  useEffect(() => {
    if (products.length > 0 && Object.keys(cartItems).length > 0) {
      const recommendation = calculateBoxRecommendation(cartItems, products);
      setBoxRecommendation(recommendation);
      console.log("Box Recommendation:", recommendation);
    }
  }, [cartItems, products]);

  // 🔥 Fetch delivery rates when address, payment method, or box recommendation changes
  useEffect(() => {
    if (selectedAddress && selectedAddress.zipCode && boxRecommendation) {
      fetchDeliveryRates();
    }
  }, [selectedAddress, method, boxRecommendation]);

  // 🎯 Calculate total extraAmount from all products in cart (HIDDEN)
  const calculateTotalExtraAmount = () => {
    let totalExtra = 0;
    
    for (const productId in cartItems) {
      const product = products.find(p => p._id === productId);
      if (!product) continue;

      for (const size in cartItems[productId]) {
        if (cartItems[productId][size] > 0) {
          const quantity = cartItems[productId][size];
          const extraAmount = product.extraAmount || 0;
          totalExtra += extraAmount * quantity;
        }
      }
    }
    
    console.log("🔒 Total Hidden Extra Amount:", totalExtra);
    return totalExtra;
  };

  const fetchDeliveryRates = async () => {
    try {
      setLoadingRates(true);

      // Get shipping dimensions from box recommendation
      const shippingDims = getShippingDimensions(boxRecommendation);

      // Calculate additional parameters
      let totalDeclaredValue = 0;
      let hasCOD = false;
      let shippingMode = "Surface";

      for (const productId in cartItems) {
        const product = products.find(p => p._id === productId);
        if (!product) continue;

        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            const quantity = cartItems[productId][size];
            totalDeclaredValue += (product.declared_value || product.price) * quantity;
            if (product.cod) hasCOD = true;
            if (product.mode === "Air") shippingMode = "Air";
          }
        }
      }

      const codValue = method === "cod" ? 1 : 0;

      const requestData = {
        pickup_postcode: "400001",
        delivery_postcode: selectedAddress.zipCode,
        weight: shippingDims.weight,
        cod: codValue,
        length: shippingDims.length,
        breadth: shippingDims.breadth,
        height: shippingDims.height,
        declared_value: totalDeclaredValue || getCartAmount(),
        mode: shippingMode
      };

      console.log(`🚚 Fetching rates for ${method.toUpperCase()} (COD: ${codValue}):`, requestData);

      const response = await axios.post(`${backendUrl}/api/rate/get-rates`, requestData);

      if (response.data.success) {
        setAvailableCouriers(response.data.couriers);
        // Auto-select cheapest courier
        if (response.data.couriers.length > 0) {
          const cheapest = response.data.couriers[0];
          setSelectedCourier(cheapest);
          
          // 🎯 Apply hidden extraAmount deduction
          const totalExtraAmount = calculateTotalExtraAmount();
          const adjustedRate = Math.max(0, cheapest.rate - totalExtraAmount);
          setDeliveryCharge(adjustedRate);

          console.log(`✅ Original rate: ₹${cheapest.rate}`);
          console.log(`🔒 Hidden deduction: -₹${totalExtraAmount}`);
          console.log(`💰 Final delivery charge: ₹${adjustedRate}`);
        }
      } else {
        toast.error(response.data.message || "Failed to fetch delivery rates");
      }
    } catch (error) {
      console.error("Error fetching delivery rates:", error);
      toast.error("Error fetching delivery rates");
    } finally {
      setLoadingRates(false);
    }
  };

  const handleCourierSelect = (courier) => {
    setSelectedCourier(courier);
    
    // 🎯 Apply hidden extraAmount deduction
    const totalExtraAmount = calculateTotalExtraAmount();
    const adjustedRate = Math.max(0, courier.rate - totalExtraAmount);
    setDeliveryCharge(adjustedRate);
    
    console.log(`✅ Selected: ${courier.name}`);
    console.log(`💰 Adjusted delivery charge: ₹${adjustedRate}`);
  };

  // 🎯 Handle payment method change
  const handleMethodChange = (newMethod) => {
    setMethod(newMethod);
    console.log(`💳 Payment method changed to: ${newMethod.toUpperCase()}`);
    toast.info(`Recalculating delivery charge for ${newMethod.toUpperCase()}...`);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("No delivery address selected");
      navigate('/cart');
      return;
    }

    if (!selectedCourier) {
      toast.error("Please wait for delivery rates to load");
      return;
    }

    if (!boxRecommendation) {
      toast.error("Box calculation in progress");
      return;
    }

    const shippingDims = getShippingDimensions(boxRecommendation);
    const totalExtraAmount = calculateTotalExtraAmount();

    const orderData = {
      deliveryInfo: {
        firstName: selectedAddress.firstName,
        lastName: selectedAddress.lastName,
        email: selectedAddress.email,
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zipCode: selectedAddress.zipCode,
        country: selectedAddress.country,
        mobile: selectedAddress.mobile
      },
      paymentMethod: method,
      shippingDetails: {
        pickup_postcode: '400001',
        delivery_postcode: selectedAddress.zipCode,
        weight: shippingDims.weight,
        length: shippingDims.length,
        breadth: shippingDims.breadth,
        height: shippingDims.height,
        declared_value: getCartAmount(),
        mode: "Surface",
        cod: method === "cod" ? 1 : 0
      },
      courierDetails: {
        courierId: selectedCourier.id,
        courierName: selectedCourier.name,
        deliveryCharge: deliveryCharge, // 🎯 Use adjusted delivery charge
        estimatedDays: selectedCourier.estimatedDays,
        originalRate: selectedCourier.rate, // 🔒 Store original for backend reference
        hiddenDiscount: totalExtraAmount // 🔒 Store hidden discount
      },
      boxRecommendation: boxRecommendation
    };

    console.log("📦 Placing order with:", {
      method: method,
      originalDeliveryCharge: selectedCourier.rate,
      hiddenDiscount: totalExtraAmount,
      finalDeliveryCharge: deliveryCharge,
      courier: selectedCourier.name
    });

    await placeOrder(orderData);
    localStorage.removeItem('selectedAddressId');
  };

  if (!selectedAddress || !boxRecommendation) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <p className='text-gray-500'>Loading...</p>
      </div>
    );
  }

  const subTotal = getCartAmount();
  const totalAmount = subTotal + deliveryCharge;

  return (
    <div className='flex flex-col gap-8 pt-5 border-t sm:pt-14 lg:flex-row'>
      {/* Left Side - Delivery Info & Box Info */}
      <div className='flex flex-col flex-1 gap-6'>
        {/* Delivery Address */}
        <div>
          <div className='mb-4 text-xl sm:text-2xl'>
            <Title text1={'DELIVERY'} text2={'INFORMATION'} />
          </div>
          <div className='p-4 border border-gray-300 rounded bg-gray-50'>
            <p className='font-semibold'>
              {selectedAddress.firstName} {selectedAddress.lastName}
            </p>
            <p className='text-sm text-gray-600'>{selectedAddress.street}</p>
            <p className='text-sm text-gray-600'>
              {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
            </p>
            <p className='text-sm text-gray-600'>{selectedAddress.country}</p>
            <p className='text-sm text-gray-600'>Mobile: {selectedAddress.mobile}</p>
            <p className='text-sm text-gray-600'>Email: {selectedAddress.email}</p>
          </div>
          <button
            onClick={() => navigate('/cart')}
            className='px-4 py-2 mt-3 text-sm border border-gray-400 rounded hover:bg-gray-50'
          >
            ← Change Address
          </button>
        </div>

        {/* Box Recommendation Display */}
        <div>
          <div className='mb-4 text-xl sm:text-2xl'>
            <Title text1={'PACKAGING'} text2={'DETAILS'} />
          </div>
          <div className='p-4 border rounded border-blue-300 bg-blue-50'>
            <div className='flex items-start justify-between mb-3'>
              <div>
                <p className='font-semibold text-blue-900'>
                  Recommended Box: {boxRecommendation.recommendedBox.name}
                </p>
                <p className='text-sm text-blue-700'>
                  Dimensions: {boxRecommendation.recommendedBox.dimensions.length} × {boxRecommendation.recommendedBox.dimensions.breadth} × {boxRecommendation.recommendedBox.dimensions.height} cm
                </p>
              </div>
              <div className='text-right'>
                <p className='text-sm font-medium text-blue-900'>
                  {boxRecommendation.totalWeight} kg
                </p>
                <p className='text-xs text-blue-600'>Total Weight</p>
              </div>
            </div>

            <div className='pt-3 mt-3 border-t border-blue-200'>
              <p className='mb-2 text-xs font-semibold text-blue-800'>Items Breakdown:</p>
              <div className='space-y-1'>
                {boxRecommendation.itemsList.map((item, idx) => (
                  <div key={idx} className='flex justify-between text-xs text-blue-700'>
                    <span>
                      {item.name} {item.size && `(${item.size})`} × {item.quantity}
                    </span>
                    <span className='font-medium'>{item.totalWeight} kg</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='pt-3 mt-3 border-t border-blue-200'>
              <div className='flex justify-between text-xs'>
                <span className='text-blue-700'>Packing Efficiency:</span>
                <span className='font-semibold text-blue-900'>{boxRecommendation.packingEfficiency}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Courier Selection */}
        <div>
          <div className='mb-4 text-xl sm:text-2xl'>
            <Title text1={'SELECT'} text2={'COURIER SERVICE'} />
          </div>

          {loadingRates ? (
            <div className='p-8 text-center border rounded'>
              <div className='flex flex-col items-center gap-2'>
                <div className='w-8 h-8 border-4 border-t-4 border-gray-200 rounded-full border-t-blue-600 animate-spin'></div>
                <p className='text-gray-500'>
                  Calculating {method === 'razorpay' ? 'online payment' : 'COD'} rates...
                </p>
              </div>
            </div>
          ) : availableCouriers.length > 0 ? (
            <div className='flex flex-col gap-3'>
              {availableCouriers.map((courier) => {
                // 🎯 Calculate adjusted rate for display
                const totalExtraAmount = calculateTotalExtraAmount();
                const adjustedRate = Math.max(0, courier.rate - totalExtraAmount);
                
                return (
                  <div
                    key={courier.id}
                    onClick={() => handleCourierSelect(courier)}
                    className={`p-4 border rounded cursor-pointer transition-all ${selectedCourier?.id === courier.id
                        ? 'border-black bg-gray-50'
                        : 'border-gray-300 hover:border-gray-400'
                      }`}
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex items-start gap-3'>
                        <input
                          type="radio"
                          checked={selectedCourier?.id === courier.id}
                          onChange={() => handleCourierSelect(courier)}
                          className='mt-1'
                        />
                        <div>
                          <p className='font-semibold'>{courier.name}</p>
                          <p className='text-sm text-gray-600'>
                            Estimated Delivery: {courier.estimatedDays || 'N/A'}
                          </p>
                          {courier.rating && (
                            <p className='text-xs text-gray-500'>Rating: {courier.rating}/5</p>
                          )}
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='font-semibold text-green-600'>
                          ₹{adjustedRate.toFixed(2)}
                        </p>
                        {method === 'razorpay' && (
                          <p className='text-xs text-green-600'>
                            No COD charges ✓
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='p-8 text-center border rounded'>
              <p className='text-gray-500'>No courier services available for this location</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Order Summary & Payment */}
      <div className='lg:min-w-[400px] lg:sticky lg:top-20 lg:self-start'>
        {/* Order Summary */}
        <div className='p-6 border rounded'>
          <h3 className='mb-4 text-xl font-semibold'>Order Summary</h3>
          <div className='flex justify-between mb-2'>
            <p className='text-gray-600'>Subtotal:</p>
            <p className='font-medium'>₹{subTotal.toFixed(2)}</p>
          </div>
          <div className='flex justify-between mb-2'>
            <p className='text-gray-600'>Delivery Charge:</p>
            <p className='font-medium text-green-600'>
              {loadingRates ? (
                <span className='text-sm text-gray-400'>Calculating...</span>
              ) : (
                <>
                  ₹{deliveryCharge.toFixed(2)}
                  {method === 'razorpay' && (
                    <span className='block text-xs text-green-600'>No COD charges</span>
                  )}
                </>
              )}
            </p>
          </div>
          <div className='pt-2 mt-2 border-t'>
            <div className='flex justify-between'>
              <p className='text-lg font-semibold'>Total:</p>
              <p className='text-lg font-semibold'>₹{totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className='mt-6'>
          <div className='mb-4 text-xl sm:text-2xl'>
            <Title text1={'PAYMENT'} text2={'METHOD'} />
          </div>
          <div className='flex flex-col gap-3'>
            <div
              onClick={() => handleMethodChange('razorpay')}
              className='flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50'
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-600' : ''}`}></p>
              <img className='h-5' src={assets.razorpay_logo} alt="RazorPay" />
              <span className='ml-auto text-xs text-green-600'>No COD fee</span>
            </div>
            <div
              onClick={() => handleMethodChange('cod')}
              className='flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50'
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-600' : ''}`}></p>
              <p className='text-sm font-medium text-gray-700'>CASH ON DELIVERY</p>
              {selectedCourier?.cod_charges > 0 && (
                <span className='ml-auto text-xs text-orange-600'>
                  +₹{selectedCourier.cod_charges} fee
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={loadingRates || !selectedCourier}
          className='w-full px-8 py-3 mt-6 text-sm text-white bg-black disabled:bg-gray-400 disabled:cursor-not-allowed active:bg-gray-800'
        >
          {loadingRates ? 'CALCULATING RATES...' : `PLACE ORDER - ₹${totalAmount.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}

export default PlaceOrder;