import React, { useEffect, useState, useRef, useCallback } from 'react'
import './Orders.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const REMOVE_DELAY = 2 * 60 * 1000; // 2 minutes in ms

const Orders = ({ url }) => {

  const [orders, setOrders] = useState([]);
  const [timers, setTimers] = useState({}); // { orderId: remainingSeconds }
  const timerRefs = useRef({}); // interval refs keyed by orderId

  const removeOrder = useCallback(async (orderId) => {
    const response = await axios.post(`${url}/api/order/remove`, { id: orderId });
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error('Error');
    }
    // Clean up interval
    if (timerRefs.current[orderId]) {
      clearInterval(timerRefs.current[orderId]);
      delete timerRefs.current[orderId];
    }
    setTimers(prev => {
      const copy = { ...prev };
      delete copy[orderId];
      return copy;
    });
    // Remove from local state immediately
    setOrders(prev => prev.filter(o => o._id !== orderId));
  }, [url]);

  const startTimer = useCallback((orderId) => {
    // Don't start if already running
    if (timerRefs.current[orderId]) return;

    const totalSeconds = REMOVE_DELAY / 1000;
    setTimers(prev => ({ ...prev, [orderId]: totalSeconds }));

    timerRefs.current[orderId] = setInterval(() => {
      setTimers(prev => {
        const remaining = (prev[orderId] ?? 0) - 1;
        if (remaining <= 0) {
          // Time's up – remove the order
          removeOrder(orderId);
          return prev;
        }
        return { ...prev, [orderId]: remaining };
      });
    }, 1000);
  }, [removeOrder]);

  const fetchAllOrders = async () => {
    const response = await axios.get(url + '/api/order/list');
    if (response.data.success) {
      setOrders(response.data.data);
      // Start timers for any already-delivered orders
      response.data.data.forEach(order => {
        if (order.status === 'Delivered') {
          startTimer(order._id);
        }
      });
    } else {
      toast.error("Error")
    }
  }

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    const response = await axios.post(url + '/api/order/status', { orderId, status: newStatus });
    if (response.data.success) {
      await fetchAllOrders();
      if (newStatus === 'Delivered') {
        startTimer(orderId);
      }
    } else {
      toast.error("Error");
    }
  }

  // Clean up all intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(timerRefs.current).forEach(clearInterval);
    };
  }, []);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (

          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + "x" + item.quantity;
                  } else {
                    return item.name + "x" + item.quantity + ", "

                  }
                })}
              </p>
              <p className="order-item-name">{order.address.firstName + " " + order.address.lastName}</p>
              <div className="order-item-address">
                <p>{order.address.street+", "}</p>
                <p>{order.address.city+", "+order.address.state+", "+order.address.country+", "+order.address.zipcode}</p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Items :{order.items.length}</p>
            <p>${order.amount}</p>
            <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out For Delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
            {timers[order._id] != null && (
              <div className="order-timer">
                <p className="timer-text">Removing in {formatTime(timers[order._id])}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders