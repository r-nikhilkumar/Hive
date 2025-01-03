import { useEffect, useState } from "react";
import "./globals.css";
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

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Listen for window resize changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <main className="flex h-screen">
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/sign-in" element={<SignInForm />} />
        </Route>

        {/* Private Routes */}
        <Route element={<RootLayout />}>
          <Route index path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/pulse" element={<Pulse />} />
          {/* Chats Route */}
          <Route path="/chats" element={<Chats />}>
            {!isMobile && <Route path=":id" element={<ChatScreen />} />}
          </Route>

          {/* For Mobile, ChatScreen directly */}
          {isMobile && <Route path="/chats/:id" element={<ChatScreen />} />}
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/u/:id" element={<Profile />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
