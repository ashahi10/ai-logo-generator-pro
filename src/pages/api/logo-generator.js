import fetch from 'node-fetch';

export default async function handler(req, res) {
  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Step 1: Create a prediction with the input prompt
    const createPredictionResponse = await fetch("https://api.replicate.com/v1/models/recraft-ai/recraft-v3-svg/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        "Prefer": "wait" // Wait until the prediction is completed
      },
      body: JSON.stringify({
        input: { prompt: prompt }
      })
    });

    // Step 2: Check if the response was successful
    if (!createPredictionResponse.ok) {
      const errorDetail = await createPredictionResponse.text();
      console.error("Error creating prediction:", errorDetail);
      return res.status(createPredictionResponse.status).json({ error: "Failed to create prediction." });
    }

    // Step 3: Parse the response JSON
    const predictionResult = await createPredictionResponse.json();
    console.log("Replicate API Prediction Result:", predictionResult.output);

    // Step 4: Extract the output URL (assuming it’s provided in the output)
    const logos = predictionResult && predictionResult.output ? [predictionResult.output] : [];

    // Step 5: Return the logos to the frontend
    res.status(200).json({ logos });
  } catch (error) {
    console.error("Error generating logo:", error);
    res.status(500).json({ error: "AI logo generation failed" });
  }
}
