//packages
import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

//files
import Navbar from './components/Navbar/Navbar.jsx'
import IntroLoader from './components/IntroLoader/IntroLoader.jsx'
import MyOrders from './pages/MyOrders/MyOrders.jsx'
import Home from './pages/Home/Home.jsx'
import Cart from './pages/Cart/Cart.jsx'
import Verify from './pages/Verify/Verify.jsx'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder.jsx'
import Footer from './components/Footer/Footer.jsx'
import LoginPopup from './components/LoginPopup/LoginPopup.jsx'

const App = () => {

  const [showLogin, setShowLogin] = useState(false)
  const [loadingDone, setLoadingDone] = useState(false)


  useEffect(() => {
  document.body.classList.add("no-scroll");

  const timer = setTimeout(() => {
    setLoadingDone(true);
    document.body.classList.remove("no-scroll");
  }, 3500);

  return () => clearTimeout(timer);
}, []);
  return (
  <>
    {!loadingDone ? (
      <IntroLoader />
    ) : (
      <>
        {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

        <div className='app'>
          <Navbar setShowLogin={setShowLogin} />

          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/order' element={<PlaceOrder />} />
            <Route path='/verify' element={<Verify />} />
            <Route path='/myorders' element={<MyOrders />} />
          </Routes>
        </div>

        <Footer />
      </>
    )}
  </>
)
}

export default App