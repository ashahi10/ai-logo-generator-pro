// src/pages/index.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function Home() {
  const [loading, setLoading] = useState(true); // Track loading state
  const router = useRouter();

  useEffect(() => {
    // Check the user's authentication status
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If the user is authenticated, redirect to LogoGenerator
        router.push("/LogoGenerator");
      } else {
        // If not authenticated, redirect to AuthPage
        router.push("/AuthPage");
      }
      setLoading(false); // Set loading to false after the redirect
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  if (loading) return <p>Loading...</p>; // Show a loading message until redirect

  return null; // Render nothing, as this page only serves as a redirect
}
