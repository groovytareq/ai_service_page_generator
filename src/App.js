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

    // We'll use both a system message (to enforce structure & style)
    // and a user message (the actual business idea).
    const systemMessage = {
      role: 'system',
      content: `
      You are an AI that writes an entire HTML page with inline CSS that is modern, minimal,
      and uses a green-and-white color scheme. The page must contain the following sections:
      1) Hero section with a main headline, subheadline, and CTA button
      2) "What You'll Learn" section (at least four points)
      3) Testimonials section (at least two testimonials)
      4) Pricing section (three plans)
      5) A final CTA section with a buy/enroll button
      6) A footer with a small note

      The copy in each section should be relevant to the user's business idea.
      Output only a single HTML file with inline CSS. Make sure it's fully responsive.
      `
    };

    const userMessage = {
      role: 'user',
      content: `My business service idea is: "${idea}". Please create a landing page with the style and structure you described.`
    };

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // or any chat model you have access to
          messages: [systemMessage, userMessage],
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error.message);
        setLandingPageCode('');
      } else {
        const generatedHTML = data.choices[0]?.message?.content?.trim() || '';
        setLandingPageCode(generatedHTML);
      }
    } catch (err) {
      setError('An error occurred while generating the landing page.');
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Green/White Landing Page Generator</h1>
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

      {/* Render the generated HTML directly as a webpage */}
      {landingPageCode && (
        <div
          className="rendered-page"
          style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '1rem' }}
          dangerouslySetInnerHTML={{ __html: landingPageCode }}
        />
      )}
    </div>
  );
}

export default App;
