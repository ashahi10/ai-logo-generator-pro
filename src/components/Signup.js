// src/components/Signup.js
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/"); // Redirect after registration
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          setErrorMessage("This email is already registered. Please log in.");
          break;
        case "auth/invalid-email":
          setErrorMessage("Invalid email format. Please enter a valid email.");
          break;
        case "auth/weak-password":
          setErrorMessage("Password is too weak. Please use a stronger password.");
          break;
        default:
          setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSignup} className="sign-up-form">
      <h2 className="title">Sign up</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="input-field">
        <i className="fas fa-envelope"></i>
        <input
          type="email"
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
      <button type="submit" className="btn">
        Sign up
      </button>
    </form>
  );
}