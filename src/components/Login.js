 // src/components/Login.js
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { auth } from "../firebase"; // Import auth instance from firebase.js

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    try {
      if (isRegistering) {
        // Register a new user
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Registration successful!");
      } else {
        // Sign in an existing user
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
      }
      router.push("/"); // Redirect to the home page after login or registration
    } catch (error) {
      console.error("Authentication error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{isRegistering ? "Register" : "Login"}</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <button
        onClick={handleAuth}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-4"
      >
        {isRegistering ? "Register" : "Login"}
      </button>
      <p className="text-center">
        {isRegistering ? "Already have an account?" : "Don't have an account?"}
        <span
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-blue-500 cursor-pointer ml-2"
        >
          {isRegistering ? "Login" : "Register"}
        </span>
      </p>
    </div>
  );
}
