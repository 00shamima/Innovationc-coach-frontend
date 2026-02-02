import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import UserDashboard from "./Pages/UserDashboard";
import CreatePost from "./Pages/CreatePost";
import Settings from "./Pages/Settings";
import UserProfile from "./Pages/UserProfile";
import Messages from "./Pages/Message"; 
import Search from "./Pages/Search";
import LoginSuccess from "./Pages/LoginSuccess";
import ResetPassword from "./Pages/ResetPassword";
import Navbar from "./Components/Navbar"; 

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />; 
  return children;
};

const Layout = ({ children }) => {
  const location = useLocation();
  
  const hideNavbar = ["/login", "/register", "/login-success", "/reset-password"].includes(location.pathname);
  
  const isMessagesPage = location.pathname === "/messages";

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      
      {!hideNavbar && <Navbar />}
      
      <main className={`flex-1 w-full ${!hideNavbar ? 'pt-16' : ''} ${(!hideNavbar && !isMessagesPage) ? 'pb-16' : ''}`}>
        {children}
      </main>

    </div>
  );
};

function App() {
  const GOOGLE_CLIENT_ID = "16927594713-d2i06u02defq1lnh5jccte51ctr5434e.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} /> 
            <Route path="/register" element={<Register />} />
            <Route path="/login-success" element={<LoginSuccess />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/user" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/profile/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;