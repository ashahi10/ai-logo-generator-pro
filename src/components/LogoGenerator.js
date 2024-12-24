import { useState, useEffect } from "react";
import { auth, incrementLogoCount, getUserData, saveFavoriteLogo } from "../firebase";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useRouter } from "next/router";
import Image from "next/image";

export default function LogoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logoCount, setLogoCount] = useState(0);
  const [user, setUser] = useState(null);
  const [showDialog, setShowDialog] = useState(false); // Controls the free trial dialog box visibility
  const [saved, setSaved] = useState(false); // Tracks if the logo is saved to favorites
  const [navActive, setNavActive] = useState(false); // Tracks the navigation bar state
  const router = useRouter();

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

  const handleLogout = () => {
    router.push("/AuthPage"); // Redirect to the signup page
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
      const img = new Image();
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

      img.src = urlBlob;
    } catch (error) {
      console.error("Failed to download logo as PNG:", error);
    }
  };

  const saveLogo = async (logoUrl) => {
    if (user) {
      await saveFavoriteLogo(user.uid, logoUrl);
      setSaved(true); // Show saved status
    }
  };

  return (
    <div className="logo-generator-page">
     <nav className={navActive ? "active" : ""} id="nav">
        <ul>
          <li><a onClick={() => router.push("/logogenerator")}>Home</a></li>
          <li><a onClick={() => router.push("/favorites")}>Favorites</a></li>
          <li><a>Ideas</a></li>
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
