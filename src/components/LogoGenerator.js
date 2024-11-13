import { useState } from "react";

export default function LogoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateLogos = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/logo-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Add this line to debug frontend response
      if (data.logos && Array.isArray(data.logos)) {
        setLogos(data.logos);
      } else if (data.logos) {
        setLogos([data.logos]);
      } else {
        setLogos([]);
      }
    } catch (error) {
      console.error("Failed to generate logos:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadLogoAsPng = async (url) => {
    try {
      // Fetch the SVG data as text
      const response = await fetch(url);
      const svgText = await response.text();
  
      // Create an image element for the SVG data
      const img = new Image();
      const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
      const urlBlob = URL.createObjectURL(svgBlob);
  
      img.onload = () => {
        // Create a canvas element to draw the SVG
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);
  
        // Convert the canvas content to PNG and trigger download
        canvas.toBlob((blob) => {
          const pngUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = pngUrl;
          link.download = "generated-logo.png"; // Download as PNG
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
  

  return (
    <div className="logo-generator-page">
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
                src={logos[0]} // Assuming logos[0] is the first generated logo
                alt="Generated Logo"
                className="logo-image"
              />
              <button
                 onClick={() => downloadLogoAsPng(logos[0])}
                className="download-button"
              >
                Download 
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}