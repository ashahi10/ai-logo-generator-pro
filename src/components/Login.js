// src/components/Login.js
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to hold custom error messages
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Redirect after successful login
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          setErrorMessage("No user found with this email.");
          break;
        case "auth/wrong-password":
          setErrorMessage("Incorrect password. Please try again.");
          break;
        case "auth/too-many-requests":
          setErrorMessage("Too many attempts. Please try again later.");
          break;
        case "auth/invalid-email":
          setErrorMessage("Invalid email format.");
          break;
        default:
          setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };


  return (
    <form onSubmit={handleLogin} className="sign-in-form">
      <h2 className="title">Login</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
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
