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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">AI Logo Generator</h1>
      <input
        type="text"
        placeholder="Enter your logo prompt..."
        className="text-black border p-2 rounded w-full mb-4"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={generateLogos}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Logos"}
      </button>
      <div className="mt-4">
        {logos.length > 0 ? (
          logos.map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`Logo ${index + 1}`}
              className="w-48 h-auto mx-2 my-4"
            />
          ))
        ) : (
          !loading && <p>No logos generated yet.</p>
        )}
      </div>
    </div>
  );
}
