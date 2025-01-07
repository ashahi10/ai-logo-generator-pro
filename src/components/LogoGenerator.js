import { useState, useEffect } from "react";
import { auth, incrementLogoCount, getUserData, saveFavoriteLogo } from "../firebase";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useRouter } from "next/router";


export default function LogoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logoCount, setLogoCount] = useState(0);
  const [user, setUser] = useState(null);
  const [showDialog, setShowDialog] = useState(false); // Controls the free trial dialog box visibility
  const [saved, setSaved] = useState(false); // Tracks if the logo is saved to favorites
  const [navActive, setNavActive] = useState(false); // Tracks the navigation bar state
  const [showComingSoonDialog, setShowComingSoonDialog] = useState(false); // Controls the "Coming Soon" dialog visibility
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace("/AuthPage");
      }
    });
  
    return () => unsubscribe();
  }, [router]);
  

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const data = await getUserData(auth.currentUser.uid);
        setLogoCount(data.logoCount);
        setUser(auth.currentUser);
      }
    };
    fetchUserData();
  }, []);

  const toggleNav = () => {
    setNavActive(!navActive);
  };

  const handleLogout = async () => {
    try {
      // Sign out the user
      await auth.signOut();
  
      // Clear session storage to ensure no cached session
      sessionStorage.clear();
  
      // Redirect to the AuthPage and ensure history is cleared
      router.replace("/AuthPage");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  const handleComingSoonClick = () => {
    setShowComingSoonDialog(true); // Show the "Coming Soon" dialog
  };
  
  

  const generateLogos = async () => {
    // Check for the 5-logo limit
    if (logoCount >= 5) {
      setShowDialog(true); // Show dialog box instead of alert
      return;
    }

    setLoading(true);
    setSaved(false); // Reset saved status when generating a new logo
    try {
      const response = await fetch("/api/logo-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      console.log("API Response:", data);
      if (data.logos && Array.isArray(data.logos)) {
        setLogos(data.logos);
      } else if (data.logos) {
        setLogos([data.logos]);
      } else {
        setLogos([]);
      }
      if (data.logos && data.logos.length > 0) {
        if (window.innerWidth <= 1366) {
          // For smaller screens like MacBook
          document.body.style.zoom = "75%";
        } else { 
          // For larger screens
          document.body.style.zoom = "100%";
        }
      } else {
        // Reset zoom if no image is generated
        document.body.style.zoom = "100%";
      }
      // Increment the logo count and update Firestore
      setLogoCount(logoCount + 1);
      await incrementLogoCount(auth.currentUser.uid);
    } catch (error) {
      console.error("Failed to generate logos:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadLogoAsPng = async (url) => {
    try {
      const response = await fetch(url);
      const svgText = await response.text();
  
      // Use window.Image to avoid conflict with next/image
      const img = new window.Image();
  
      // Create a Blob for the SVG text
      const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
      const urlBlob = URL.createObjectURL(svgBlob);
  
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);
  
        canvas.toBlob((blob) => {
          const pngUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = pngUrl;
          link.download = "generated-logo.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(pngUrl);
        }, "image/png");
        URL.revokeObjectURL(urlBlob);
      };
  
      img.onerror = (e) => {
        console.error("Error loading image for download", e);
      };
  
      img.src = urlBlob;
    } catch (error) {
      console.error("Failed to download logo as PNG:", error);
    }
  };
  
  return (
    <div className="logo-generator-page">
     <div className="bg-animation">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div id="stars4"></div>
    </div>

     <nav className={navActive ? "active" : ""} id="nav">
        <ul>
          <li><a onClick={() => router.push("/logogenerator")}>Home</a></li>
          <li><a onClick={handleComingSoonClick}>Favorites</a></li>
          <li><a onClick={handleComingSoonClick}>Pricing</a></li>
          <li><a onClick={handleLogout}>Logout</a></li>
        </ul>
        <button className="icon" id="toggle" onClick={toggleNav}>
          <div className="line line1"></div>
          <div className="line line2"></div>
        </button>
      </nav>
      <div className="logo-generator-container">
        <h1 className="title">LogoGenAI</h1>
        <p className="subtitle">Create unique logos by entering a description below</p>
        <input
          type="text"
          placeholder="Enter your logo prompt..."
          className="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={generateLogos}
          className="generate-button"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate "}
        </button>
        {loading && (
          <div className="loader-overlay">
    <svg className="loader-svg" viewBox="0 0 256 128" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5ebd3e" />
          <stop offset="33%" stopColor="#ffb900" />
          <stop offset="67%" stopColor="#f78200" />
          <stop offset="100%" stopColor="#e23838" />
        </linearGradient>
        <linearGradient id="grad2" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#e23838" />
          <stop offset="33%" stopColor="#973999" />
          <stop offset="67%" stopColor="#009cdf" />
          <stop offset="100%" stopColor="#5ebd3e" />
        </linearGradient>
      </defs>
      <g fill="none" strokeLinecap="round" strokeWidth="16">
        <g className="ip__track" stroke="#ddd">
          <path d="M8,64s0-56,60-56,60,112,120,112,60-56,60-56" />
          <path d="M248,64s0-56-60-56-60,112-120,112S8,64,8,64" />
        </g>
        <g strokeDasharray="180 656">
          <path className="loader-worm1" stroke="url(#grad1)" strokeDashoffset="0" d="M8,64s0-56,60-56,60,112,120,112,60-56,60-56" />
          <path className="loader-worm2" stroke="url(#grad2)" strokeDashoffset="358" d="M248,64s0-56-60-56-60,112-120,112S8,64,8,64" />
        </g>
      </g>
    </svg>
  </div>
)}

        <div className="logos-container">
          {logos.length > 0 && (
            <>
            <img
                src={logos[0]}
                alt="Generated Logo"
                className="logo-image"
              />
              <button
                onClick={() => downloadLogoAsPng(logos[0])}
                className="download-button"
              >
                Download
              </button>
              {/* <button
                onClick={() => saveLogo(logos[0])}
                className="favorite-button"
                title={saved ? "Saved to Favorites" : "Add to Favorites"}
              >
                {saved ? <FaHeart color="red" size={30} /> : <FaRegHeart size={30} />}
              </button> */}
            </>
          )}
        </div>
      </div>
      {showDialog && (
        <DialogBox
          message="Your free trial has ended! Please upgrade to continue."
          onClose={() => setShowDialog(false)}
        />
      )}
      {showComingSoonDialog && (
  <DialogBox
    message="This feature is coming soon! Stay tuned."
    onClose={() => setShowComingSoonDialog(false)}
  />
)}
    </div>
    
  );
}

// DialogBox Component for displaying custom dialog
function DialogBox({ message, onClose }) {
  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <p>{message}</p>
        <button onClick={onClose} className="close-button">OK</button>
      </div>
    </div>
  );
}
