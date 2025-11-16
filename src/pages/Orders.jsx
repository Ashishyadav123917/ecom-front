


import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {
  const { currency, backendUrl, navigate } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingModal, setTrackingModal] = useState(false);
  const [selectedTracking, setSelectedTracking] = useState(null);
  const [loadingTracking, setLoadingTracking] = useState(false);

  const fetchOrders = async () => {
    try {
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        toast.error("Please login to view orders");
        navigate("/login");
        return;
      }

      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/order/user/${userId}`);
      
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }).toUpperCase();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending':
        return 'bg-yellow-500';
      case 'Processing':
        return 'bg-blue-500';
      case 'Shipped':
        return 'bg-purple-500';
      case 'Delivered':
        return 'bg-green-500';
      case 'Cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const trackOrder = async (order) => {
    if (!order.shippingId) {
      toast.info("Your order is being processed by our team. Tracking will be available soon!");
      return;
    }

    try {
      setLoadingTracking(true);
      setTrackingModal(true);
      
      const response = await axios.get(`${backendUrl}/api/rate/track/${order.shippingId}`);
      
      if (response.data.success) {
        setSelectedTracking(response.data.tracking);
      } else {
        toast.error("Failed to fetch tracking information");
        setTrackingModal(false);
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      toast.error("Error loading tracking information");
      setTrackingModal(false);
    } finally {
      setLoadingTracking(false);
    }
  };

  const closeTrackingModal = () => {
    setTrackingModal(false);
    setSelectedTracking(null);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center pt-16 min-h-[60vh]'>
        <p className='text-xl text-gray-500'>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className='pt-16 border-t'>
      <div className='text-2xl'>
        <Title text1={'YOUR'} text2={'ORDERS'} />
      </div>
      
      {orders.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20'>
          <p className='text-xl text-gray-500'>No orders yet</p>
          <button 
            onClick={() => navigate('/collection')}
            className='px-8 py-3 mt-6 text-sm text-white bg-black active:bg-gray-700'
          >
            START SHOPPING
          </button>
        </div>
      ) : (
        <div>
          {orders.map((order, index) => (
            <div key={order._id || index} className='mb-8'>
              <div className='flex items-center justify-between p-4 mb-2 bg-gray-50'>
                <div>
                  <p className='text-sm font-medium'>Order ID: {order._id}</p>
                  {order.shippingId && (
                    <p className='text-xs text-gray-600'>Tracking ID: {order.shippingId}</p>
                  )}
                </div>
                <p className='text-sm text-gray-600'>
                  Total: {currency} {order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              
              {order.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex} 
                  className='flex flex-col gap-4 py-4 text-gray-700 border-t border-b md:flex-row md:items-center md:justify-between'
                >
                  <div className='flex items-start gap-6 text-sm'>
                    <img 
                      className='w-16 sm:w-20' 
                      src={item.productId?.image?.[0] || '/placeholder.jpg'} 
                      alt="Product" 
                    />
                    <div>
                      <p className='font-medium sm:text-base'>
                        {item.productId?.name || 'Product not found'}
                      </p>
                      <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                        <p className='text-lg'>
                          {currency}&nbsp;{(item.productId?.price || 0).toLocaleString(undefined, { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}
                        </p>
                        <p>Quantity:&nbsp;{item.quantity}</p>
                        {item.size && <p>Size:&nbsp;{item.size}</p>}
                      </div>
                      <p className='mt-2'>
                        Date:&nbsp;
                        <span className='text-gray-400'>{formatDate(order.date)}</span>
                      </p>
                      {order.courierName && (
                        <p className='mt-1 text-xs text-gray-600'>
                          Courier: {order.courierName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className='flex justify-between md:w-1/2'>
                    <div className='flex items-center gap-2'>
                      <p className={`h-2 rounded-full min-w-2 ${getStatusColor(order.status)}`}></p>
                      <p className='text-sm md:text-base'>{order.status}</p>
                    </div>
                    <button 
                      onClick={() => trackOrder(order)}
                      className='px-4 py-2 text-sm font-medium border rounded-sm hover:bg-gray-50'
                    >
                      {order.shippingId ? 'TRACK ORDER' : 'VIEW STATUS'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Tracking Modal */}
      {trackingModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50' onClick={closeTrackingModal}>
          <div className='w-full max-w-2xl p-6 mx-4 bg-white rounded-lg max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold'>Order Tracking</h2>
              <button
                onClick={closeTrackingModal}
                className='text-gray-500 hover:text-gray-700'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            {loadingTracking ? (
              <div className='flex items-center justify-center py-20'>
                <div className='w-12 h-12 border-b-2 border-gray-900 rounded-full animate-spin'></div>
              </div>
            ) : selectedTracking ? (
              <div>
                {/* Tracking Header */}
                <div className='p-4 mb-6 rounded-lg bg-gray-50'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <p className='text-sm text-gray-600'>AWB Code</p>
                      <p className='font-medium'>{selectedTracking.awbCode || 'N/A'}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>Courier</p>
                      <p className='font-medium'>{selectedTracking.courierName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>Current Status</p>
                      <p className='font-medium text-blue-600'>{selectedTracking.currentStatus}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>Est. Delivery</p>
                      <p className='font-medium'>{selectedTracking.estimatedDelivery || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div>
                  <h3 className='mb-4 text-lg font-semibold'>Tracking History</h3>
                  {selectedTracking.trackingActivities && selectedTracking.trackingActivities.length > 0 ? (
                    <div className='relative space-y-4'>
                      {/* Timeline line */}
                      <div className='absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200'></div>
                      
                      {selectedTracking.trackingActivities.map((activity, idx) => (
                        <div key={idx} className='relative flex gap-4'>
                          <div className='relative z-10 flex-shrink-0'>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              idx === 0 ? 'bg-blue-600' : 'bg-gray-300'
                            }`}>
                              <div className='w-3 h-3 bg-white rounded-full'></div>
                            </div>
                          </div>
                          <div className='flex-1 pb-4'>
                            <p className='font-medium'>{activity.status}</p>
                            {activity.location && (
                              <p className='text-sm text-gray-600'>{activity.location}</p>
                            )}
                            <p className='text-xs text-gray-500'>{activity.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-gray-500'>No tracking activities available yet.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className='py-10 text-center'>
                <p className='text-gray-500'>No tracking information available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;