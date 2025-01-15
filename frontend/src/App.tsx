import React from 'react'
import Home from './pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/SignUp'
import Login from './pages/Login'
import StockMarketGuide from './component/Guide'
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<Login />} />
          <Route path='/guide' element={<StockMarketGuide/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App