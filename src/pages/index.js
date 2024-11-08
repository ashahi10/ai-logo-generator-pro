// src/pages/index.js
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Login from "../components/Login";
import LogoGenerator from "../components/LogoGenerator";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for changes in authentication status
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">AI Logo Generator</h1>
      {user ? <LogoGenerator /> : <Login />}
    </div>
  );
}
