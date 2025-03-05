import React, { useState } from 'react';
import './App.css';

function App() {
  const [idea, setIdea] = useState('');
  const [landingPageCode, setLandingPageCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateLandingPage = async () => {
    setLoading(true);
    setError(null);

    // Construct the prompt with the provided business service idea
    const prompt = `I have a business service idea: ${idea}. Using your internal logic, generate a complete landing page design that best represents this idea. Automatically determine the optimal sections (such as a hero introduction, features, testimonials, pricing, and a call-to-action) and ensure that a buy button is included prominently within the design. Output a fully functional HTML/CSS code snippet that is modern, responsive, and ready for further customization.`;

    try {
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Use your OpenAI API key from an environment variable
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          prompt: prompt,
          max_tokens: 1024,
          temperature: 0.7,
          // Optionally adjust other parameters as needed
        })
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error.message);
        setLandingPageCode('');
      } else {
        setLandingPageCode(data.choices[0].text.trim());
      }
    } catch (err) {
      setError('An error occurred while generating the landing page.');
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Landing Page Generator</h1>
      <input
        type="text"
        placeholder="Enter your business service idea"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
      />
      <button onClick={generateLandingPage} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Landing Page'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {landingPageCode && (
        <div className="generated-code">
          <h2>Generated Landing Page Code</h2>
          <textarea
            readOnly
            value={landingPageCode}
            style={{ width: '100%', height: '400px' }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
