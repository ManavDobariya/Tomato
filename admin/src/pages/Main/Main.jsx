import React from 'react'
import './Main.css'
import { assets } from '../../assets/assets'

const Main = () => {
  return (
    <div className="main-page">
      <div className="main-welcome-card">
        <div className="main-logo-glow"></div>
        <img src={assets.logo} alt="Tomato Admin Panel Logo" className="main-logo" />
        <h1 className="main-title">
          Welcome to <span>Admin Panel</span>
        </h1>
      </div>
    </div>
  )
}

export default Main
