import React, { useState, useEffect } from 'react'
import PromptCard from './components/PromptCard'


const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'


export default function App() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [error, setError] = useState(null)
  const [mode, setMode] = useState('text');

  useEffect(() => {
    async function fetchHistory() {
      const endpoint = mode === 'text' ? '/api/history' : '/api/image-history';
      try {
        const resp = await fetch(`${API_BASE}${endpoint}`);
        if (!resp.ok) throw new Error('Failed to fetch history');
        const data = await resp.json();
        setHistory(data.history || []);
      } catch (err) {
        setHistory([]);
      }
    }
    fetchHistory();
  }, [mode])


  async function handleSubmit(e) {
    e.preventDefault()
    if (!prompt.trim()) return
    setLoading(true)
    setError(null)

    try {
      const endpoint = mode === 'text' ? '/api/generate' : '/api/generate-image';
      const resp = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model: mode === 'text' ? "gpt-4o" : "dall-e-3",
          max_tokens: 512,
          temperature: 0.7,
        }),
      })


      if (!resp.ok) {
        const body = await resp.json()
        throw new Error(body.detail || 'API error')
      }

      const data = await resp.json()
      const entry = {
        id: data.id || Date.now().toString(),
        prompt: data.prompt,
        image_url: data.image_url,
        response: data.response,
        model: data.model,
        mode: mode,
        createdAt: data.createdAt,
      }

      setHistory(prev => [entry, ...prev].slice(0, 50))
      setPrompt('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function clearHistory() {
    // Optionally, add a backend endpoint to clear Redis history
    await fetch(`${API_BASE}/api/history`, { method: 'DELETE' });
    setHistory([])
  }

  return (
    <div className="container">
      <header className="header">
        <h1>AI WebApp</h1>
        <p className="subtitle">Type a prompt and get AI-powered responses (OpenAI)</p>
      </header>

      <main>
        <div className="mode-toggle">
          <button
            className={mode === 'text' ? 'active' : ''}
            onClick={() => setMode('text')}
          >
            Text
          </button>
          <button
            className={mode === 'image' ? 'active' : ''}
            onClick={() => setMode('image')}
          >
            Image
          </button>
        </div>
        <form onSubmit={handleSubmit} className="prompt-form">
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Ask for ideas, summaries, captions, etc..."
            rows={4}
          />
          <div className="form-actions">
            <button type="submit" disabled={loading}>{loading ? 'Generating...' : 'Generate'}</button>
            <button type="button" onClick={() => setPrompt('')}>Clear</button>
          </div>
        </form>

        {error && <div className="error">{error}</div>}


        <section className="history">
          <div className="history-head">
            <h2>History</h2>
            <div>
              <button onClick={clearHistory}>Clear history</button>
            </div>
          </div>


          {history.length === 0 ? (
            <div className="empty">No history yet — try a prompt!</div>
          ) : (
            history.map(item => (
              <PromptCard key={item.id} item={item} />
            ))
          )}
        </section>
      </main>


      <footer className="footer">
        <small>Built with FastAPI + OpenAI • Deploy to AWS</small>
      </footer>
    </div>
  )
}