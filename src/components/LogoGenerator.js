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

  const downloadLogo = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "generated-logo.png";
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Failed to download logo:", error);
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
                onClick={() => downloadLogo(logos[0])}
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