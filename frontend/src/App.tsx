
import Home from './pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/SignUp'
import Login from './pages/Login'
import StockMarketGuide from './component/Guide'
import LiveStocks from './pages/LiveStocks'
import PennyStock from './pages/PennyStocks'
import SIP from './pages/SIP'
import { useWebSocket,} from './websocket/useWebSocket'
const App = () => {
  const { indices, gainers, losers, weekData } = useWebSocket();
  console.log({ indices, gainers, losers, weekData });
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<Login />} />
          <Route path='/guide' element={<StockMarketGuide/>}/>
          <Route path="/live-stocks" element={<LiveStocks />} />
          <Route path="/penny-stocks" element={<PennyStock />} />
          <Route path="/sip" element={<SIP />} />

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App