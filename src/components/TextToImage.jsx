

 import React, { useState } from "react";

const TextToImage = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateImage = async () => {
    setLoading(true);
    setError("");
    setImageUrl(null);

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer hf_YourAPIKEY",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-2xl font-bold">Text to Image Generator</h1>
      <input
        type="text"
        className="border p-2 w-full max-w-md rounded"
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={generateImage}
        disabled={loading || !prompt}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="Generated" className="rounded shadow-lg max-w-md" />
          <a
            href={imageUrl}
            download="generated-image.png"
            className="block mt-2 text-blue-600 underline"
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
};

export default TextToImage;
