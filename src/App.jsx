// import React from 'react'
// import { Route, Routes } from 'react-router-dom'
// import Home from './pages/Home'
// import Collection from './pages/Collection'
// import About from './pages/About'
// import Contact from './pages/Contact'
// import Product from './pages/Product'
// import Cart from './pages/Cart'
// import Login from './pages/Login'
// import PlaceOrder from './pages/PlaceOrder'
// import Orders from './pages/Orders'
// import NavBar from './components/NavBar'
// import Footer from './components/Footer'
// import SearchBar from './components/SearchBar'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const App = () => {
//   return (
//     <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
//       <ToastContainer />
//       <NavBar />
//       <SearchBar />
//       <Routes>
//         <Route path='/' element={<Home />} />
//         <Route path='/collection' element={<Collection />} />
//         <Route path='/about' element={<About />} />
//         <Route path='/contact' element={<Contact />} />
//         <Route path='/product/:productId' element={<Product />} />
//         <Route path='/cart' element={<Cart />} />
//         <Route path='/login' element={<Login />} />
//         <Route path='/place-order' element={<PlaceOrder />} />
//         <Route path='/orders' element={<Orders />} />
//       </Routes>
//       <Footer />
//     </div>
//   )
// }

// export default App




import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import SearchBar from './components/SearchBar'
import About from './pages/About'
import AddressManagement from './pages/AddressManagement'
import Cart from './pages/Cart'
import Category from './pages/Category'
import Collection from './pages/Collection'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Login from './pages/Login'
import NewUser from './pages/NewUser'
import Orders from './pages/Orders'
import PlaceOrder from './pages/PlaceOrder'
import Product from './pages/Product'
import Profile from "./pages/Profile"



export const backendUrl =  "https://mern-ecome.onrender.com"||  "http://localhost:4000";

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <NavBar />
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/category' element={<Category />} />
        <Route path='/AddressManagement' element={<AddressManagement />} />
        <Route path='/newuser' element={<NewUser />} />
<Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App