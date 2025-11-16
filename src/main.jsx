// import { createRoot } from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'
// import { BrowserRouter } from 'react-router-dom'
// import ShopContextProvider from './context/ShopContext.jsx'
// // import AuthContexttProvider from './context/AuthContect.jsx'

// createRoot(document.getElementById('root')).render(
//   <BrowserRouter>
//       {/* <AuthContexttProvider> */}
//       <ShopContextProvider>
//       <App />
//     </ShopContextProvider>
//     {/* </AuthContexttProvider> */}
//   </BrowserRouter>,
// )

import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider from './context/ShopContext.jsx'
import AuthContextProvider from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthContextProvider>
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </AuthContextProvider>
  </BrowserRouter>
)