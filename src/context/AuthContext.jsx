import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  // const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    //const backendUrl = "https://mern-ecome.onrender.com" || "http://localhost:4000";
      const backendUrl = "http://localhost:4000";
  // Load token from localStorage when app starts
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/login`, {
        email,
        password,
      });

console.log("this is the response  of login" ,   response);




      if (response.data.success) {
        const newToken = response.data.token;
  const userId = response.data.userId;


        localStorage.setItem("token", newToken);
        localStorage.setItem("userId", userId);
        setToken(newToken);
        
        if (response.data.user) {
          setUser(response.data.user);
        }
        
        toast.success("Login successful!");
        return { success: true };
      } else {
        toast.error(response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Login failed!";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Register function
  const register = async (name, email, mobile, password) => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/register`, {
        name,
        email,
        mobile,
        password,
      });

      if (response.data.success) {
        const newToken = response.data.token;
        const userId = response.data.userId;

        localStorage.setItem("token", newToken);
        localStorage.setItem("userId", userId);

        setToken(newToken);
        
        if (response.data.user) {
          setUser(response.data.user);
        }
        
        toast.success("Account created successfully!");
        return { success: true };
      } else {
        toast.error(response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Register error:", error);
      const errorMessage = error.response?.data?.message || "Registration failed!";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("userId");                  
    setToken("");
    setUser(null);
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  const value = {
    token,
    setToken,
    user,
    setUser,
    loading,
    login,
    register,
    logout,
    backendUrl,
  };

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;