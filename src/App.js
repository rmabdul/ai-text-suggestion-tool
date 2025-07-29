import React, { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSuggest = async () => {
    if (!input) return;
    setLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Suggest a professional response for: "${input}"`,
            },
          ],
          temperature: 0.7,
          max_tokens: 60,
        }),
      });

      const data = await response.json();
      console.log("OpenAI response:", data);
      const message = data.choices?.[0]?.message?.content?.trim();
      setSuggestion(message || "No suggestion found.");
    } catch (error) {
      setSuggestion("Error fetching suggestion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>AI Text Suggestion Tool</h2>
      <textarea
        rows="4"
        cols="60"
        placeholder="Enter your sentence..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <br />
      <button onClick={handleSuggest} disabled={loading}>
        {loading ? "Generating..." : "Suggest"}
      </button>
      <div style={{ marginTop: "1rem", fontStyle: "italic" }}>
        {suggestion && (
          <>
            <strong>Suggestion:</strong> {suggestion}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
