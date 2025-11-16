


// // import React, { useContext, useEffect, useState } from 'react';
// // import { ShopContext } from '../context/ShopContext';
// // import Title from '../components/Title';
// // import { assets } from '../assets/assets';
// // import CartTotal from '../components/CartTotal';

// // const Cart = () => {
// //   const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
// //   const [cartData, setCartData] = useState([]);

// //   useEffect(() => {
// //     const tempData = [];
// //     for (const items in cartItems) {
// //       for (const item in cartItems[items]) {
// //         if (cartItems[items][item] > 0) {
// //           tempData.push({
// //             _id: items,
// //             size: item,
// //             quantity: cartItems[items][item],
// //           });
// //         }
// //       }
// //     }
// //     setCartData(tempData);
// //   }, [cartItems]);

// //   const isCartEmpty = cartData.length === 0;

// //   return (
// //     <div className='border-t pt-14'>
// //       <div className='mb-3 text-2xl'>
// //         <Title text1={'YOUR'} text2={'CART'} />
// //       </div>
      
// //       {isCartEmpty ? (
// //         <div className='flex flex-col items-center justify-center py-20'>
// //           <img src={assets.cart_icon} alt="Empty Cart" className='w-32 h-32 mb-6 opacity-20' />
// //           <p className='mb-4 text-xl text-gray-500'>Your cart is empty</p>
// //           <button 
// //             onClick={() => navigate('/collection')}
// //             className='px-8 py-3 text-white bg-black hover:bg-gray-800'
// //           >
// //             Continue Shopping
// //           </button>
// //         </div>
// //       ) : (
// //         <>
// //           <div>
// //             {cartData.map((item, index) => {
// //               const productData = products.find((product) => product._id === item._id);

// //               if (!productData) return null;

// //               const imageUrl = Array.isArray(productData.image) ? productData.image[0] : productData.image || assets.upload_area;

// //               return (
// //                 <div key={index} className='grid py-4 text-gray-700 border-t border-b grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
// //                   <div className='flex items-start gap-6'>
// //                     <img className='w-16 sm:w-20' src={imageUrl} alt={productData.name} />
// //                     <div>
// //                       <p className='text-sm font-medium sm:text-lg'>{productData.name}</p>
// //                       <div className='flex items-center gap-5 mt-2'>
// //                         <p>
// //                           {currency}&nbsp;{productData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
// //                         </p>
// //                         <p className='px-2 border sm:px-3 sm:py-1 bg-slate-50'>{item.size}</p>
// //                       </div>
// //                     </div>
// //                   </div>
// //                   <input
// //                     onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))}
// //                     className='px-1 py-1 border max-w-10 sm:max-w-20 sm:px-2'
// //                     type="number"
// //                     min={1}
// //                     defaultValue={item.quantity}
// //                   />
// //                   <img
// //                     onClick={() => updateQuantity(item._id, item.size, 0)}
// //                     className='w-4 mr-4 cursor-pointer sm:w-5'
// //                     src={assets.bin_icon}
// //                     alt="Remove"
// //                   />
// //                 </div>
// //               );
// //             })}
// //           </div>
          
// //           <div className='flex justify-end my-20'>
// //             <div className='w-full sm:w-[450px]'>
// //               <CartTotal showShippingFee={false} />
// //               <div className='w-full text-end'>
// //                 <button 
// //                   onClick={() => navigate('/place-order')} 
// //                   className='px-8 py-3 my-8 text-sm text-white bg-black active:bg-gray-700'
// //                 >
// //                   PROCEED TO CHECKOUT
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </>
// //       )}
// //     </div>
// //   );
// // }

// // export default Cart;






// import React, { useContext, useEffect, useState } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import Title from '../components/Title';
// import { assets } from '../assets/assets';
// import CartTotal from '../components/CartTotal';
// import { toast } from 'react-toastify';

// const Cart = () => {
//   const { products, currency, cartItems, updateQuantity, navigate, 
//     addresses, addAddress, deleteAddress, setDefaultAddress, fetchAddresses } = useContext(ShopContext);
//   const [cartData, setCartData] = useState([]);
//   const [selectedAddressId, setSelectedAddressId] = useState(null);
//   const [showAddressForm, setShowAddressForm] = useState(false);
  
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     street: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     country: '',
//     mobile: ''
//   });

//   useEffect(() => {
//     fetchAddresses();
//   }, []);

//   useEffect(() => {
//     const tempData = [];
//     for (const items in cartItems) {
//       for (const item in cartItems[items]) {
//         if (cartItems[items][item] > 0) {
//           tempData.push({
//             _id: items,
//             size: item,
//             quantity: cartItems[items][item],
//           });
//         }
//       }
//     }
//     setCartData(tempData);
//   }, [cartItems]);

//   useEffect(() => {
//     // Auto-select default address
//     if (addresses.length > 0 && !selectedAddressId) {
//       const defaultAddress = addresses.find(addr => addr.isDefault);
//       if (defaultAddress) {
//         setSelectedAddressId(defaultAddress._id);
//       } else {
//         setSelectedAddressId(addresses[0]._id);
//       }
//     }
//   }, [addresses]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleAddAddress = async () => {
//     // Validate form data
//     if (!formData.firstName || !formData.lastName || !formData.email || 
//         !formData.street || !formData.city || !formData.state || 
//         !formData.zipCode || !formData.country || !formData.mobile) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     const success = await addAddress(formData);
//     if (success) {
//       setShowAddressForm(false);
//       // Reset form
//       setFormData({
//         firstName: '',
//         lastName: '',
//         email: '',
//         street: '',
//         city: '',
//         state: '',
//         zipCode: '',
//         country: '',
//         mobile: ''
//       });
//     }
//   };

//   const handleDeleteAddress = async (addressId) => {
//     if (window.confirm("Are you sure you want to delete this address?")) {
//       await deleteAddress(addressId);
//       if (selectedAddressId === addressId) {
//         setSelectedAddressId(null);
//       }
//     }
//   };

//   const handleProceedToCheckout = () => {
//     if (!selectedAddressId) {
//       toast.error("Please select a delivery address");
//       return;
//     }
    
//     // Store selected address in localStorage for PlaceOrder page
//     localStorage.setItem('selectedAddressId', selectedAddressId);
//     navigate('/place-order');
//   };

//   const isCartEmpty = cartData.length === 0;

//   return (
//     <div className='border-t pt-14'>
//       <div className='mb-3 text-2xl'>
//         <Title text1={'YOUR'} text2={'CART'} />
//       </div>
      
//       {isCartEmpty ? (
//         <div className='flex flex-col items-center justify-center py-20'>
//           <img src={assets.cart_icon} alt="Empty Cart" className='w-32 h-32 mb-6 opacity-20' />
//           <p className='mb-4 text-xl text-gray-500'>Your cart is empty</p>
//           <button 
//             onClick={() => navigate('/collection')}
//             className='px-8 py-3 text-white bg-black hover:bg-gray-800'
//           >
//             Continue Shopping
//           </button>
//         </div>
//       ) : (
//         <>
//           <div>
//             {cartData.map((item, index) => {
//               const productData = products.find((product) => product._id === item._id);

//               if (!productData) return null;

//               const imageUrl = Array.isArray(productData.image) ? productData.image[0] : productData.image || assets.upload_area;

//               return (
//                 <div key={index} className='grid py-4 text-gray-700 border-t border-b grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
//                   <div className='flex items-start gap-6'>
//                     <img className='w-16 sm:w-20' src={imageUrl} alt={productData.name} />
//                     <div>
//                       <p className='text-sm font-medium sm:text-lg'>{productData.name}</p>
//                       <div className='flex items-center gap-5 mt-2'>
//                         <p>
//                           {currency}&nbsp;{productData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                         </p>
//                         <p className='px-2 border sm:px-3 sm:py-1 bg-slate-50'>{item.size}</p>
//                       </div>
//                     </div>
//                   </div>
//                   <input
//                     onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))}
//                     className='px-1 py-1 border max-w-10 sm:max-w-20 sm:px-2'
//                     type="number"
//                     min={1}
//                     defaultValue={item.quantity}
//                   />
//                   <img
//                     onClick={() => updateQuantity(item._id, item.size, 0)}
//                     className='w-4 mr-4 cursor-pointer sm:w-5'
//                     src={assets.bin_icon}
//                     alt="Remove"
//                   />
//                 </div>
//               );
//             })}
//           </div>

//           {/* Delivery Address Section */}
//           <div className='my-10'>
//             <div className='mb-4 text-xl sm:text-2xl'>
//               <Title text1={'DELIVERY'} text2={'ADDRESS'} />
//             </div>

//             {showAddressForm ? (
//               <div className='flex flex-col max-w-2xl gap-3'>
//                 <div className='flex gap-3'>
//                   <input 
//                     className='w-full px-4 py-2 border border-gray-300 rounded' 
//                     type="text" 
//                     name="firstName"
//                     placeholder='First Name'
//                     value={formData.firstName}
//                     onChange={handleChange}
//                   />
//                   <input 
//                     className='w-full px-4 py-2 border border-gray-300 rounded' 
//                     type="text" 
//                     name="lastName"
//                     placeholder='Last Name'
//                     value={formData.lastName}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <input 
//                   className='w-full px-4 py-2 border border-gray-300 rounded' 
//                   type="email" 
//                   name="email"
//                   placeholder='Email Address'
//                   value={formData.email}
//                   onChange={handleChange}
//                 />
//                 <input 
//                   className='w-full px-4 py-2 border border-gray-300 rounded'  
//                   type="text" 
//                   name="street"
//                   placeholder='Street'
//                   value={formData.street}
//                   onChange={handleChange}
//                 />
//                 <div className='flex gap-3'>
//                   <input 
//                     className='w-full px-4 py-2 border border-gray-300 rounded' 
//                     type="text" 
//                     name="city"
//                     placeholder='City'
//                     value={formData.city}
//                     onChange={handleChange}
//                   />
//                   <input 
//                     className='w-full px-4 py-2 border border-gray-300 rounded' 
//                     type="text" 
//                     name="state"
//                     placeholder='State'
//                     value={formData.state}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className='flex gap-3'>
//                   <input 
//                     className='w-full px-4 py-2 border border-gray-300 rounded' 
//                     type="text" 
//                     name="zipCode"
//                     placeholder='Zip Code'
//                     value={formData.zipCode}
//                     onChange={handleChange}
//                   />
//                   <input 
//                     className='w-full px-4 py-2 border border-gray-300 rounded' 
//                     type="text" 
//                     name="country"
//                     placeholder='Country'
//                     value={formData.country}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <input 
//                   className='w-full px-4 py-2 border border-gray-300 rounded' 
//                   type="tel" 
//                   name="mobile"
//                   placeholder='Mobile'
//                   value={formData.mobile}
//                   onChange={handleChange}
//                 />
//                 <div className='flex gap-3'>
//                   <button
//                     onClick={handleAddAddress}
//                     className='flex-1 px-4 py-2 text-white bg-black rounded hover:bg-gray-800'
//                   >
//                     Save Address
//                   </button>
//                   <button
//                     onClick={() => setShowAddressForm(false)}
//                     className='flex-1 px-4 py-2 border border-gray-400 rounded hover:bg-gray-50'
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {addresses.length > 0 ? (
//                   <div className='flex flex-col max-w-2xl gap-3'>
//                     <div className='flex items-center justify-between'>
//                       <p className='text-sm font-medium text-gray-700'>Select Delivery Address:</p>
//                       <button
//                         onClick={() => setShowAddressForm(true)}
//                         className='px-4 py-2 text-sm border border-gray-400 rounded hover:bg-gray-50'
//                       >
//                         + Add New Address
//                       </button>
//                     </div>

//                     {addresses.map((address) => (
//                       <div
//                         key={address._id}
//                         className={`p-4 border rounded cursor-pointer ${
//                           selectedAddressId === address._id ? 'border-black bg-gray-50' : 'border-gray-300'
//                         }`}
//                         onClick={() => setSelectedAddressId(address._id)}
//                       >
//                         <div className='flex items-start justify-between'>
//                           <div className='flex items-start gap-2'>
//                             <input
//                               type="radio"
//                               checked={selectedAddressId === address._id}
//                               onChange={() => setSelectedAddressId(address._id)}
//                               className='mt-1'
//                             />
//                             <div>
//                               <p className='font-semibold'>
//                                 {address.firstName} {address.lastName}
//                                 {address.isDefault && (
//                                   <span className='ml-2 text-xs text-green-600'>(Default)</span>
//                                 )}
//                               </p>
//                               <p className='text-sm text-gray-600'>{address.street}</p>
//                               <p className='text-sm text-gray-600'>
//                                 {address.city}, {address.state} {address.zipCode}
//                               </p>
//                               <p className='text-sm text-gray-600'>{address.country}</p>
//                               <p className='text-sm text-gray-600'>Mobile: {address.mobile}</p>
//                               <p className='text-sm text-gray-600'>Email: {address.email}</p>
//                             </div>
//                           </div>
//                           <div className='flex gap-2'>
//                             {!address.isDefault && (
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   setDefaultAddress(address._id);
//                                 }}
//                                 className='text-xs text-blue-600 hover:text-blue-800'
//                               >
//                                 Set Default
//                               </button>
//                             )}
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleDeleteAddress(address._id);
//                               }}
//                               className='text-xs text-red-600 hover:text-red-800'
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className='max-w-2xl p-6 text-center border rounded'>
//                     <p className='mb-4 text-gray-600'>No saved addresses found.</p>
//                     <button
//                       onClick={() => setShowAddressForm(true)}
//                       className='px-6 py-2 text-white bg-black rounded hover:bg-gray-800'
//                     >
//                       + Add Address
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
          
//           <div className='flex justify-end my-20'>
//             <div className='w-full sm:w-[450px]'>
//               <CartTotal showShippingFee={false} />
//               <div className='w-full text-end'>
//                 <button 
//                   onClick={handleProceedToCheckout} 
//                   className='px-8 py-3 my-8 text-sm text-white bg-black active:bg-gray-700'
//                 >
//                   PROCEED TO CHECKOUT
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default Cart;











import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { toast } from 'react-toastify';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, 
    addresses, addAddress, deleteAddress, setDefaultAddress, fetchAddresses } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    mobile: ''
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  useEffect(() => {
    // Auto-select default address
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
      } else {
        setSelectedAddressId(addresses[0]._id);
      }
    }
  }, [addresses]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddAddress = async () => {
    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.street || !formData.city || !formData.state || 
        !formData.zipCode || !formData.country || !formData.mobile) {
      toast.error("Please fill all fields");
      return;
    }

    const success = await addAddress(formData);
    if (success) {
      setShowAddressForm(false);
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        mobile: ''
      });
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      await deleteAddress(addressId);
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
      }
    }
  };

  const handleProceedToCheckout = () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }
    
    // Store selected address in localStorage for PlaceOrder page
    localStorage.setItem('selectedAddressId', selectedAddressId);
    navigate('/place-order');
  };

  const isCartEmpty = cartData.length === 0;

  return (
    <div className='border-t pt-14'>
      <div className='mb-3 text-2xl'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>
      
      {isCartEmpty ? (
        <div className='flex flex-col items-center justify-center py-20'>
          <img src={assets.cart_icon} alt="Empty Cart" className='w-32 h-32 mb-6 opacity-20' />
          <p className='mb-4 text-xl text-gray-500'>Your cart is empty</p>
          <button 
            onClick={() => navigate('/collection')}
            className='px-8 py-3 text-white bg-black hover:bg-gray-800'
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className='mb-8'>
            {cartData.map((item, index) => {
              const productData = products.find((product) => product._id === item._id);

              if (!productData) return null;

              const imageUrl = Array.isArray(productData.image) ? productData.image[0] : productData.image || assets.upload_area;

              return (
                <div key={index} className='grid py-4 text-gray-700 border-t border-b grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                  <div className='flex items-start gap-6'>
                    <img className='w-16 sm:w-20' src={imageUrl} alt={productData.name} />
                    <div>
                      <p className='text-sm font-medium sm:text-lg'>{productData.name}</p>
                      <div className='flex items-center gap-5 mt-2'>
                        <p>
                          {currency}&nbsp;{productData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className='px-2 border sm:px-3 sm:py-1 bg-slate-50'>{item.size}</p>
                      </div>
                    </div>
                  </div>
                  <input
                    onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))}
                    className='px-1 py-1 border max-w-10 sm:max-w-20 sm:px-2'
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                  />
                  <img
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    className='w-4 mr-4 cursor-pointer sm:w-5'
                    src={assets.bin_icon}
                    alt="Remove"
                  />
                </div>
              );
            })}
          </div>

          {/* Two Column Layout for Desktop, Stacked for Mobile */}
          <div className='flex flex-col gap-8 lg:flex-row lg:items-start'>
            {/* Left Side - Delivery Address Section */}
            <div className='flex-1 lg:max-w-2xl'>
              <div className='mb-4 text-xl sm:text-2xl'>
                <Title text1={'DELIVERY'} text2={'ADDRESS'} />
              </div>

              {showAddressForm ? (
                <div className='flex flex-col gap-3'>
                  <div className='flex gap-3'>
                    <input 
                      className='w-full px-4 py-2 border border-gray-300 rounded' 
                      type="text" 
                      name="firstName"
                      placeholder='First Name'
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    <input 
                      className='w-full px-4 py-2 border border-gray-300 rounded' 
                      type="text" 
                      name="lastName"
                      placeholder='Last Name'
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <input 
                    className='w-full px-4 py-2 border border-gray-300 rounded' 
                    type="email" 
                    name="email"
                    placeholder='Email Address'
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <input 
                    className='w-full px-4 py-2 border border-gray-300 rounded'  
                    type="text" 
                    name="street"
                    placeholder='Street'
                    value={formData.street}
                    onChange={handleChange}
                  />
                  <div className='flex gap-3'>
                    <input 
                      className='w-full px-4 py-2 border border-gray-300 rounded' 
                      type="text" 
                      name="city"
                      placeholder='City'
                      value={formData.city}
                      onChange={handleChange}
                    />
                    <input 
                      className='w-full px-4 py-2 border border-gray-300 rounded' 
                      type="text" 
                      name="state"
                      placeholder='State'
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                  <div className='flex gap-3'>
                    <input 
                      className='w-full px-4 py-2 border border-gray-300 rounded' 
                      type="text" 
                      name="zipCode"
                      placeholder='Zip Code'
                      value={formData.zipCode}
                      onChange={handleChange}
                    />
                    <input 
                      className='w-full px-4 py-2 border border-gray-300 rounded' 
                      type="text" 
                      name="country"
                      placeholder='Country'
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                  <input 
                    className='w-full px-4 py-2 border border-gray-300 rounded' 
                    type="tel" 
                    name="mobile"
                    placeholder='Mobile'
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                  <div className='flex gap-3'>
                    <button
                      onClick={handleAddAddress}
                      className='flex-1 px-4 py-2 text-white bg-black rounded hover:bg-gray-800'
                    >
                      Save Address
                    </button>
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className='flex-1 px-4 py-2 border border-gray-400 rounded hover:bg-gray-50'
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {addresses.length > 0 ? (
                    <div className='flex flex-col gap-3'>
                      <div className='flex items-center justify-between'>
                        <p className='text-sm font-medium text-gray-700'>Select Delivery Address:</p>
                        <button
                          onClick={() => setShowAddressForm(true)}
                          className='px-4 py-2 text-sm border border-gray-400 rounded hover:bg-gray-50'
                        >
                          + Add New Address
                        </button>
                      </div>

                      {/* Scrollable container on mobile */}
                      <div className='flex flex-col gap-3 overflow-y-auto max-h-96 lg:max-h-none'>
                        {addresses.map((address) => (
                          <div
                            key={address._id}
                            className={`p-4 border rounded cursor-pointer ${
                              selectedAddressId === address._id ? 'border-black bg-gray-50' : 'border-gray-300'
                            }`}
                            onClick={() => setSelectedAddressId(address._id)}
                          >
                            <div className='flex items-start justify-between'>
                              <div className='flex items-start gap-2'>
                                <input
                                  type="radio"
                                  checked={selectedAddressId === address._id}
                                  onChange={() => setSelectedAddressId(address._id)}
                                  className='mt-1'
                                />
                                <div>
                                  <p className='font-semibold'>
                                    {address.firstName} {address.lastName}
                                    {address.isDefault && (
                                      <span className='ml-2 text-xs text-green-600'>(Default)</span>
                                    )}
                                  </p>
                                  <p className='text-sm text-gray-600'>{address.street}</p>
                                  <p className='text-sm text-gray-600'>
                                    {address.city}, {address.state} {address.zipCode}
                                  </p>
                                  <p className='text-sm text-gray-600'>{address.country}</p>
                                  <p className='text-sm text-gray-600'>Mobile: {address.mobile}</p>
                                  <p className='text-sm text-gray-600'>Email: {address.email}</p>
                                </div>
                              </div>
                              <div className='flex flex-col gap-1'>
                                {!address.isDefault && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDefaultAddress(address._id);
                                    }}
                                    className='text-xs text-blue-600 hover:text-blue-800'
                                  >
                                    Set Default
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteAddress(address._id);
                                  }}
                                  className='text-xs text-red-600 hover:text-red-800'
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className='p-6 text-center border rounded'>
                      <p className='mb-4 text-gray-600'>No saved addresses found.</p>
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className='px-6 py-2 text-white bg-black rounded hover:bg-gray-800'
                      >
                        + Add Address
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right Side - Order Summary (Sticky on Desktop) */}
            <div className='w-full lg:w-auto lg:min-w-[400px] lg:sticky lg:top-20'>
              <CartTotal showShippingFee={false} />
              <div className='w-full mt-6 text-end'>
                <button 
                  onClick={handleProceedToCheckout} 
                  className='w-full px-8 py-3 text-sm text-white bg-black lg:w-auto active:bg-gray-700'
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;