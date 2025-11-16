// import React, { useContext, useState, useEffect } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import Title from '../components/Title';
// import { toast } from 'react-toastify';

// const AddressManagement = () => {
//   const { addresses, addAddress, deleteAddress, setDefaultAddress, updateAddress, fetchAddresses } = useContext(ShopContext);
  
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
  
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

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const resetForm = () => {
//     setFormData({
//       firstName: '',
//       lastName: '',
//       email: '',
//       street: '',
//       city: '',
//       state: '',
//       zipCode: '',
//       country: '',
//       mobile: ''
//     });
//     setShowForm(false);
//     setEditingId(null);
//   };

//   const handleSubmit = async () => {
//     // Validate form data
//     if (!formData.firstName || !formData.lastName || !formData.email || 
//         !formData.street || !formData.city || !formData.state || 
//         !formData.zipCode || !formData.country || !formData.mobile) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       toast.error("Please enter a valid email address");
//       return;
//     }

//     // Mobile validation (basic)
//     if (formData.mobile.length < 10) {
//       toast.error("Please enter a valid mobile number");
//       return;
//     }

//     let success;
//     if (editingId) {
//       success = await updateAddress(editingId, formData);
//     } else {
//       success = await addAddress(formData);
//     }

//     if (success) {
//       resetForm();
//     }
//   };

//   const handleEdit = (address) => {
//     setFormData({
//       firstName: address.firstName,
//       lastName: address.lastName,
//       email: address.email,
//       street: address.street,
//       city: address.city,
//       state: address.state,
//       zipCode: address.zipCode,
//       country: address.country,
//       mobile: address.mobile
//     });
//     setEditingId(address._id);
//     setShowForm(true);
//   };

//   const handleDelete = async (addressId) => {
//     if (window.confirm("Are you sure you want to delete this address?")) {
//       await deleteAddress(addressId);
//     }
//   };

//   const handleSetDefault = async (addressId) => {
//     await setDefaultAddress(addressId);
//   };

//   return (


//     <div className='border-t pt-10 min-h-[80vh]'>
//       <div className='max-w-4xl mx-auto px-4'>
//         {/* Page Title */}
//         <div className='mb-8 text-2xl'>
//           <Title text1={'ADDRESS'} text2={'MANAGEMENT'} />
//         </div>

//         {/* Add New Address Button */}
//         {!showForm && (
//           <button
//             onClick={() => setShowForm(true)}
//             className='px-6 py-3 mb-6 text-white bg-black rounded hover:bg-gray-800'
//           >
//             + Add New Address
//           </button>
//         )}

//         {/* Address Form */}
//         {showForm && (
//           <div className='p-6 mb-6 border rounded-lg bg-gray-50'>
//             <h3 className='mb-4 text-lg font-semibold'>
//               {editingId ? 'Edit Address' : 'Add New Address'}
//             </h3>
//             <div className='flex flex-col gap-4'>
//               <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
//                 <input 
//                   className='px-4 py-2 border border-gray-300 rounded' 
//                   type="text" 
//                   name="firstName"
//                   placeholder='First Name *'
//                   value={formData.firstName}
//                   onChange={handleChange}
//                 />
//                 <input 
//                   className='px-4 py-2 border border-gray-300 rounded' 
//                   type="text" 
//                   name="lastName"
//                   placeholder='Last Name *'
//                   value={formData.lastName}
//                   onChange={handleChange}
//                 />
//               </div>
              
//               <input 
//                 className='px-4 py-2 border border-gray-300 rounded' 
//                 type="email" 
//                 name="email"
//                 placeholder='Email Address *'
//                 value={formData.email}
//                 onChange={handleChange}
//               />
              
//               <input 
//                 className='px-4 py-2 border border-gray-300 rounded'  
//                 type="text" 
//                 name="street"
//                 placeholder='Street Address *'
//                 value={formData.street}
//                 onChange={handleChange}
//               />
              
//               <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
//                 <input 
//                   className='px-4 py-2 border border-gray-300 rounded' 
//                   type="text" 
//                   name="city"
//                   placeholder='City *'
//                   value={formData.city}
//                   onChange={handleChange}
//                 />
//                 <input 
//                   className='px-4 py-2 border border-gray-300 rounded' 
//                   type="text" 
//                   name="state"
//                   placeholder='State *'
//                   value={formData.state}
//                   onChange={handleChange}
//                 />
//               </div>
              
//               <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
//                 <input 
//                   className='px-4 py-2 border border-gray-300 rounded' 
//                   type="text" 
//                   name="zipCode"
//                   placeholder='Zip Code *'
//                   value={formData.zipCode}
//                   onChange={handleChange}
//                 />
//                 <input 
//                   className='px-4 py-2 border border-gray-300 rounded' 
//                   type="text" 
//                   name="country"
//                   placeholder='Country *'
//                   value={formData.country}
//                   onChange={handleChange}
//                 />
//               </div>
              
//               <input 
//                 className='px-4 py-2 border border-gray-300 rounded' 
//                 type="tel" 
//                 name="mobile"
//                 placeholder='Mobile Number *'
//                 value={formData.mobile}
//                 onChange={handleChange}
//               />
              
//               <div className='flex gap-3 mt-2'>
//                 <button
//                   onClick={handleSubmit}
//                   className='flex-1 px-6 py-2 text-white bg-black rounded hover:bg-gray-800'
//                 >
//                   {editingId ? 'Update Address' : 'Save Address'}
//                 </button>
//                 <button
//                   onClick={resetForm}
//                   className='flex-1 px-6 py-2 border border-gray-400 rounded hover:bg-gray-100'
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Saved Addresses List */}
//         <div>
//           <h3 className='mb-4 text-lg font-semibold'>Saved Addresses</h3>
          
//           {addresses.length === 0 ? (
//             <div className='p-8 text-center border rounded-lg'>
//               <p className='mb-2 text-gray-600'>No saved addresses yet.</p>
//               <p className='text-sm text-gray-500'>Add your first address to get started.</p>
//             </div>
//           ) : (
//             <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
//               {addresses.map((address) => (
//                 <div
//                   key={address._id}
//                   className='relative p-5 border rounded-lg hover:shadow-md transition-shadow'
//                 >
//                   {address.isDefault && (
//                     <div className='absolute top-3 right-3'>
//                       <span className='px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full'>
//                         Default
//                       </span>
//                     </div>
//                   )}
                  
//                   <div className='mb-4'>
//                     <h4 className='text-lg font-semibold text-gray-800'>
//                       {address.firstName} {address.lastName}
//                     </h4>
//                     <p className='mt-2 text-sm text-gray-600'>{address.street}</p>
//                     <p className='text-sm text-gray-600'>
//                       {address.city}, {address.state} {address.zipCode}
//                     </p>
//                     <p className='text-sm text-gray-600'>{address.country}</p>
//                     <p className='mt-2 text-sm text-gray-600'>
//                       <span className='font-medium'>Mobile:</span> {address.mobile}
//                     </p>
//                     <p className='text-sm text-gray-600'>
//                       <span className='font-medium'>Email:</span> {address.email}
//                     </p>
//                   </div>
                  
//                   <div className='flex flex-wrap gap-2 pt-3 border-t'>
//                     {!address.isDefault && (
//                       <button
//                         onClick={() => handleSetDefault(address._id)}
//                         className='px-4 py-1.5 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50'
//                       >
//                         Set as Default
//                       </button>
//                     )}
//                     <button
//                       onClick={() => handleEdit(address)}
//                       className='px-4 py-1.5 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50'
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(address._id)}
//                       className='px-4 py-1.5 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50'
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddressManagement;

import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { toast } from 'react-toastify';

const AddressManagement = () => {
  const { addresses, addAddress, deleteAddress, setDefaultAddress, updateAddress, fetchAddresses } = useContext(ShopContext);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
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
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.street || !formData.city || !formData.state || 
        !formData.zipCode || !formData.country || !formData.mobile) {
      toast.error("Please fill all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (formData.mobile.length < 10) {
      toast.error("Please enter a valid mobile number");
      return;
    }

    let success;
    if (editingId) {
      success = await updateAddress(editingId, formData);
    } else {
      success = await addAddress(formData);
    }

    if (success) {
      resetForm();
    }
  };

  const handleEdit = (address) => {
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      email: address.email,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      mobile: address.mobile
    });
    setEditingId(address._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      await deleteAddress(addressId);
    }
  };

  const handleSetDefault = async (addressId) => {
    await setDefaultAddress(addressId);
  };

  return (
    <div className='min-h-screen border-t'>
      <div className='container px-4 py-10 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
        <div className='mb-10 text-center'>
          <Title text1={'MY'} text2={'ADDRESSES'} />
          <p className='mt-3 text-gray-600'>Manage your delivery addresses</p>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <div className='lg:col-span-1'>
            {showForm ? (
              <div className='sticky p-6 bg-white border rounded-lg shadow-sm top-8'>
                <div className='flex items-center justify-between mb-6'>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    {editingId ? 'Edit Address' : 'Add New Address'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className='text-2xl text-gray-400 hover:text-gray-600'
                  >
                    ×
                  </button>
                </div>
                
                <div className='flex flex-col gap-4'>
                  <div className='grid grid-cols-2 gap-3'>
                    <input 
                      className='px-4 py-2.5 text-sm border rounded-md focus:ring-2 focus:ring-black focus:outline-none' 
                      type="text" 
                      name="firstName"
                      placeholder='First Name'
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    <input 
                      className='px-4 py-2.5 text-sm border rounded-md focus:ring-2 focus:ring-black focus:outline-none' 
                      type="text" 
                      name="lastName"
                      placeholder='Last Name'
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <input 
                    className='px-4 py-2.5 text-sm border rounded-md focus:ring-2 focus:ring-black focus:outline-none' 
                    type="email" 
                    name="email"
                    placeholder='Email Address'
                    value={formData.email}
                    onChange={handleChange}
                  />
                  
                  <input 
                    className='px-4 py-2.5 text-sm border rounded-md focus:ring-2 focus:ring-black focus:outline-none'  
                    type="text" 
                    name="street"
                    placeholder='Street Address'
                    value={formData.street}
                    onChange={handleChange}
                  />
                  
                  <div className='grid grid-cols-2 gap-3'>
                    <input 
                      className='px-4 py-2.5 text-sm border rounded-md focus:ring-2 focus:ring-black focus:outline-none' 
                      type="text" 
                      name="city"
                      placeholder='City'
                      value={formData.city}
                      onChange={handleChange}
                    />
                    <input 
                      className='px-4 py-2.5 text-sm border rounded-md focus:ring-2 focus:ring-black focus:outline-none' 
                      type="text" 
                      name="state"
                      placeholder='State'
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className='grid grid-cols-2 gap-3'>
                    <input 
                      className='px-4 py-2.5 text-sm border rounded-md focus:ring-2 focus:ring-black focus:outline-none' 
                      type="text" 
                      name="zipCode"
                      placeholder='Zip Code'
                      value={formData.zipCode}
                      onChange={handleChange}
                    />
                    <input 
                      className='px-4 py-2.5 text-sm border rounded-md focus:ring-2 focus:ring-black focus:outline-none' 
                      type="text" 
                      name="country"
                      placeholder='Country'
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <input 
                    className='px-4 py-2.5 text-sm border rounded-md focus:ring-2 focus:ring-black focus:outline-none' 
                    type="tel" 
                    name="mobile"
                    placeholder='Mobile Number'
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                  
                  <button
                    onClick={handleSubmit}
                    className='w-full px-4 py-3 mt-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800'
                  >
                    {editingId ? 'Update Address' : 'Save Address'}
                  </button>
                </div>
              </div>
            ) : (
              <div className='sticky p-8 text-center bg-white border rounded-lg shadow-sm top-8'>
                <h3 className='mb-3 text-lg font-semibold text-gray-900'>Add New Address</h3>
                <p className='mb-6 text-sm text-gray-600'>Save your delivery locations for faster checkout</p>
                <button
                  onClick={() => setShowForm(true)}
                  className='w-full px-6 py-3 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800'
                >
                  Add Address
                </button>
              </div>
            )}
          </div>

          <div className='lg:col-span-2'>
            {addresses.length === 0 ? (
              <div className='flex flex-col items-center justify-center p-16 bg-white border rounded-lg shadow-sm'>
                <h3 className='mb-2 text-xl font-semibold text-gray-900'>No Addresses Saved</h3>
                <p className='mb-8 text-sm text-gray-600'>Add your first delivery address to get started</p>
                <button
                  onClick={() => setShowForm(true)}
                  className='px-8 py-3 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800'
                >
                  Add Your First Address
                </button>
              </div>
            ) : (
              <div className='space-y-4'>
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className='relative p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow'
                  >
                    {address.isDefault && (
                      <div className='absolute top-5 right-5'>
                        <span className='px-3 py-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full'>
                          Default
                        </span>
                      </div>
                    )}
                    
                    <div className='mb-5 pr-28'>
                      <h4 className='text-lg font-semibold text-gray-900 mb-3'>
                        {address.firstName} {address.lastName}
                      </h4>
                      <div className='space-y-1.5 text-sm text-gray-600'>
                        <p>{address.street}</p>
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                        <p>{address.country}</p>
                        <p className='pt-2'>Phone: {address.mobile}</p>
                        <p>Email: {address.email}</p>
                      </div>
                    </div>
                    
                    <div className='flex flex-wrap gap-2 pt-4 border-t'>
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address._id)}
                          className='px-4 py-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100'
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(address)}
                        className='px-4 py-2 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(address._id)}
                        className='px-4 py-2 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100'
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressManagement;