// src/components/Signup.js
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Import auth instance from firebase.js
import { useRouter } from "next/router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration successful!");
      router.push("/"); // Redirect to the home page after registration
    } catch (error) {
      console.error("Signup error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
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
        onClick={handleSignup}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-4"
      >
        Register
      </button>
      <p className="text-center">
        Already have an account?{" "}
        <a href="/login" className="text-blue-500">
          Login
        </a>
      </p>
    </div>
  );
}
