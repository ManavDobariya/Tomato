import React, { useContext, useEffect } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";


import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext';
import { useState } from 'react';

const PlaceOrder = () => {

  const { getTotalCartAmount, food_list, cartItems, url, token } = useContext(StoreContext)
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const placeOrder = async (event) => {
    event.preventDefault();

    let ordersItems = [];

    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        ordersItems.push({
          id: item._id,
          name: item.name,
          price: item.price,
          quantity: cartItems[item._id]
        });
      }
    });

    let orderData = {
      address: data,
      items: ordersItems,
      amount: getTotalCartAmount() + 2
    };

    try {
      let response = await axios.post(
        `${url}/api/order/place`,
        orderData,
        { headers: { token } }
      );

      if (response.data.success) {

        const { order_id, amount, key, dbOrderId } = response.data;

        const options = {
          key,
          amount,
          currency: "INR",
          name: "Food App",
          description: "Order Payment",
          order_id,

          handler: async function () {
            await axios.post(`${url}/api/order/verify`, {
              orderId: dbOrderId,
              success: "true"
            });

            window.location.href = `/verify?success=true&orderId=${dbOrderId}`;
          },

          modal: {
            ondismiss: async function () {
              await axios.post(`${url}/api/order/verify`, {
                orderId: dbOrderId,
                success: "false" 
              });

              window.location.href = `/verify?success=false&orderId=${dbOrderId}`;
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

      } else {
        alert("Error");
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    if(!token){
      navigate('/cart')
    }else if(getTotalCartAmount() === 0){
      navigate('/cart')
    }
  },[token])



  return (
    <form className='place-order' onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required onChange={onChangeHandler} value={data.firstName} name="firstName" placeholder="First Name" />
          <input required onChange={onChangeHandler} value={data.lastName} name="lastName" placeholder="Last Name" />
        </div>
        <input required onChange={onChangeHandler} value={data.email} type="email" name="email" placeholder='Email Address' />
        <input required onChange={onChangeHandler} value={data.street} type="text" name="street" placeholder='Street' />
        <div className="multi-fields">
          <input required onChange={onChangeHandler} value={data.city} name="city" placeholder="City" />
          <input required onChange={onChangeHandler} value={data.state} name="state" placeholder="State" />
        </div>
        <div className="multi-fields">
          <input required onChange={onChangeHandler} value={data.zipcode} name="zipcode" type="text" placeholder="Zip Code" />
          <input required onChange={onChangeHandler} value={data.country} name="country" type="text" placeholder="Country" />
        </div>
        <input required onChange={onChangeHandler} value={data.phone} type="text" name="phone" placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>

            <div className="cart-total-details">
              <p>SubTotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type='submit'>PROSEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder