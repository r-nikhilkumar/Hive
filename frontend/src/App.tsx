import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import SignInForm from "./_auth/auth_forms/SignInForm";
import SignUpForm from "./_auth/auth_forms/SignUpForm";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import {
  Home,
  Explore,
  Chats,
  CreatePost,
  Pulse,
  Settings,
  Profile,
} from "./_root/pages/index";
import ChatScreen from "./components/shared/chats/ChatScreen";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./globals.css";
import Notifications from "./_root/pages/Notifications";
import { connectSocket } from "./redux/api/socket";
import { useSelector } from "react-redux";
import NotFound from "./components/NotFound"; // Import the NotFound component
import EditPost from "./_root/pages/EditPost";

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const isAuthenticated = useSelector((state:any) => state.auth.isAuthenticated);

  // Listen for window resize changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
    }
  }, [isAuthenticated]);

  // if (isUserLoading) return <div className="flex justify-center items-center h-screen"><Loader/></div>; // Show loader while fetching user details

  return (
    <main>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/sign-in" element={<SignInForm />} />
        </Route>

        {/* Private Routes */}

        <Route element={<RootLayout />}>
          <Route index path="/" element={<Home />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/explore" element={<Explore />} />
            <Route path="/pulse" element={<Pulse />} />
            {/* Chats Route */}
            <Route path="/chats" element={<Chats />}>
              {!isMobile && <Route path=":id" element={<ChatScreen />} />}
            </Route>

            {/* For Mobile, ChatScreen directly */}
            {isMobile && <Route path="/chats/:id" element={<ChatScreen />} />}
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:id" element={<EditPost />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notification" element={<Notifications />} />
            <Route path="/u/:id" element={<Profile />} />
          </Route>
        </Route>

        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default App;
