import { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 사용자 메시지 추가
    const userMessage = {
      type: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('http://localhost:3000/ml/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });
      
      const data = await response.json();
      
      const aiMessage = {
        type: 'ai',
        content: data.response
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="avatar">
              {message.type === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">{message.content}</div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="chat-input"
        />
        <button type="submit" className="send-button">전송</button>
      </form>
    </div>
  );
}

export default App;
