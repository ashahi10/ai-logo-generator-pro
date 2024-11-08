// src/pages/AuthPage.js
import { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

export default function AuthPage() {
  const [isSignUpMode, setIsSignUpMode] = useState(true);

  return (
    <div className="auth-page"> {/* Add this wrapper */}
      <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
        <div className="forms-container">
          <div className="signin-signup">
            {isSignUpMode ? <Signup /> : <Login />}
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here?</h3>
              <p>Welcome! Sign up to start your journey with us.</p>
              <button
                className="btn transparent"
                onClick={() => setIsSignUpMode(true)}
              >
                Sign up
              </button>
            </div>
            <img src="/img/log.svg" className="image" alt="Sign up" />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>Already have an account?</h3>
              <p>Log in to continue.</p>
              <button
                className="btn transparent"
                onClick={() => setIsSignUpMode(false)}
              >
                Sign in
              </button>
            </div>
            <img src="/img/register.svg" className="image" alt="Sign in" />
          </div>
        </div>
      </div>
    </div>
  );
}
