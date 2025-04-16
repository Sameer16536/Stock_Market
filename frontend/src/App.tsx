
import Home from './pages/Home'
import { BrowserRouter, Route, Routes,Navigate } from 'react-router-dom'
import SignUpPage from './pages/SignUp'
import Login from './pages/Login'
import StockMarketGuide from './component/Guide'
import LiveStocks from './pages/LiveStocks'
import PennyStock from './pages/PennyStocks'
import SIP from './pages/SIP'
import Profile from './component/Profile'
import {useState,useEffect} from 'react'
const App = () => {
  const [isUserLoggedIn,setIsUserLoggedIn] = useState(false)
  const token = localStorage.getItem('authToken')
  useEffect(() => {
    setIsUserLoggedIn(!!token);
  }, []);
  
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<Login />} />
          <Route
          path="/guide"
          element={isUserLoggedIn ? <StockMarketGuide /> : <Navigate to="/login" replace />} 
        />
        <Route
          path="/live-stocks"
          element={isUserLoggedIn ? <LiveStocks /> : <Navigate to="/login" replace />} 
        />
        <Route
          path="/penny-stocks"
          element={isUserLoggedIn ? <PennyStock /> : <Navigate to="/login" replace />} 
        />
        <Route
          path="/sip"
          element={isUserLoggedIn ? <SIP /> : <Navigate to="/login" replace />} 
        />
        <Route
          path="/profile"
          element={isUserLoggedIn ? <Profile /> : <Navigate to="/login" replace />} 
        />

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App