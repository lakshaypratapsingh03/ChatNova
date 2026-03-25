import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import { Route, Routes, useLocation } from 'react-router-dom'
import Credits from './pages/Credits.jsx'
import ChatBox from './components/ChatBox.jsx'
import { assets } from './assets/assets.js'
import './assets/prism.css'
import Loading from './pages/Loading.jsx'
import { useAppContext } from './context/AppContext.jsx'
import Login from './pages/Login.jsx'
import {Toaster} from 'react-hot-toast'
import "prismjs/themes/prism.css"
import "prismjs/themes/prism-tomorrow.css"
import ForgotPassword from "./pages/ForgotPassword.jsx";

const App = () => {

  const {user, loadingUser} = useAppContext()

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {pathname} = useLocation()

  if(pathname === '/loading' || loadingUser) return <Loading />

  return (
    <>
    <Toaster />
      {!isMenuOpen && <img src={assets.menu_icon} className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert' onClick={() => setIsMenuOpen(true)} />}
      
    {user ? (
      <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white'>
        <div className='flex h-screen w-screen'>
      {/* Backdrop (click outside to close) — only on mobile */}
          
          {isMenuOpen && (
            <div
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-white/20 dark:bg-transparent/10 z-10 md:hidden"
            />
          )}

          <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <Routes>
            <Route path="/" element={<ChatBox />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/loading" element={<Loading />} />
           
          </Routes>
        </div>
      </div>
    ): (
      <div className='bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen'>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<Login />} />
    </Routes>
  </div>

    )}
    </>
  )
}

export default App
