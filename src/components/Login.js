// src/components/Login.js
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      router.push("/"); // Redirect after login
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="sign-in-form">
      <h2 className="title">Login</h2>
      <div className="input-field">
        <i className="fas fa-envelope"></i>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-field">
        <i className="fas fa-lock"></i>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="btn solid">
        Login
      </button>
    </form>
  );
}
