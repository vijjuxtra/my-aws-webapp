
import { useState } from 'react';
import './style.css';

function App() {
  const [message, setMessage] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();
      setMessage(data.reply);
    } catch (error) {
      setMessage('Error connecting to API');
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <h1>🤖 AI Chat</h1>
      
      <div className="message">
        {message || 'Ask me anything!'}
      </div>

      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />

      <button onClick={sendMessage} disabled={loading}>
        {loading ? (
          <>
            <span className="loading"></span>
            Thinking...
          </>
        ) : (
          'Send Message'
        )}
      </button>
    </div>
  );
}

export default App;
