// import React, { useState, useContext, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { ShopContext } from "../context/ShopContext";

// const Login = () => {
//   const [currentState, setCurrentState] = useState("Sign Up");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
  
//   const navigate = useNavigate();
//   const { token, setToken, backendUrl } = useContext(ShopContext);

//   // Redirect if already logged in
//   useEffect(() => {
//     if (token) {
//       navigate("/");
//     }
//   }, [token, navigate]);

//   const onSubmitHandler = async (event) => {
//     event.preventDefault();
//     setLoading(true);

//     try {
//       if (currentState === "Sign Up") {
//         // Register new user
//         const response = await axios.post(`${backendUrl}/api/user/register`, {
//           name,
//           email,
//           password,
//         });

//         if (response.data.success) {
//           // Store token in localStorage
//           localStorage.setItem("token", response.data.token);
//           toast.success("Account created successfully!");
//           navigate("/"); // Redirect to home page
//         } else {
//           toast.error(response.data.message);
//         }
//       } else {
//         // Login existing user
//         const response = await axios.post(`${backendUrl}/api/user/login`, {
//           email,
//           password,
//         });

//         if (response.data.success) {
//           // Store token in localStorage
//           localStorage.setItem("token", response.data.token);
//           toast.success("Login successful!");
//           navigate("/"); // Redirect to home page
//         } else {
//           toast.error(response.data.message);
//         }
//       }
//     } catch (error) {
//       console.error("Auth error:", error);
//       toast.error(error.response?.data?.message || "Something went wrong!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={onSubmitHandler}
//       className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
//     >
//       <div className="inline-flex items-center gap-2 mt-10 mb-2">
//         <p className="text-3xl prata-regular">{currentState}</p>
//         <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
//       </div>

//       {currentState === "Sign Up" && (
//         <input
//           type="text"
//           className="w-full px-3 py-2 border border-gray-800"
//           placeholder="John Doe"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
//       )}

//       <input
//         type="email"
//         className="w-full px-3 py-2 border border-gray-800"
//         placeholder="hello@gmail.com"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />

//       <input
//         type="password"
//         className="w-full px-3 py-2 border border-gray-800"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />

//       <div className="flex justify-between w-full text-sm mt-[-8px]">
//         <p className="cursor-pointer">Forgot your password?</p>
//         {currentState === "Login" ? (
//           <p
//             onClick={() => setCurrentState("Sign Up")}
//             className="cursor-pointer"
//           >
//             Create a new account
//           </p>
//         ) : (
//           <p
//             onClick={() => setCurrentState("Login")}
//             className="cursor-pointer"
//           >
//             Login here
//           </p>
//         )}
//       </div>

//       <button
//         type="submit"
//         disabled={loading}
//         className="px-8 py-2 mt-4 font-light text-white bg-black disabled:bg-gray-400 disabled:cursor-not-allowed"
//       >
//         {loading ? "Processing..." : currentState === "Login" ? "Sign In" : "Sign Up"}
//       </button>
//     </form>
//   );
// };

// export default Login;



import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { token, login, register } = useContext(AuthContext);



  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      let result;
      
      if (currentState === "Sign Up") {
        result = await register(name, email, password);
      } else {
        result = await login(email, password);
      }

      if (result.success) {
        // Navigate with replace to prevent going back to login
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mt-10 mb-2">
        <p className="text-3xl prata-regular">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === "Sign Up" && (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}

      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="hello@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="flex justify-between w-full text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer"
          >
            Create a new account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer"
          >
            Login here
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-8 py-2 mt-4 font-light text-white bg-black disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;