import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './DirectMessage.css';

function DirectMessage({ recipient, onClose, onMessageSent }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUserId = localStorage.getItem('userId');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch existing messages when component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/messages/conversation/${currentUserId}/${recipient._id}`);
        setMessages([...response.data].reverse()); // Reverse the messages array
        scrollToBottom();
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };
    
    fetchMessages();
  }, [currentUserId, recipient._id]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      // Send the message directly
      const response = await axios.post('http://localhost:3000/api/messages', {
        sender: currentUserId,
        recipient: recipient._id,
        content: message.trim()
      });

      // Add new message to the messages array
      setMessages(prev => [...prev.slice(0, -1), response.data, prev.slice(-1)]);
      
      // Clear input and notify parent
      setMessage('');
      if (onMessageSent) {
        onMessageSent(response.data);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="direct-message">
      <div className="direct-message-header">
        <button className="close-button" onClick={onClose}>
          <span className="material-symbols-rounded">close</span>
        </button>
        <div className="recipient-info">
          <img 
            src={recipient.profilePicture || "https://via.placeholder.com/40"} 
            alt={recipient.name.display} 
          />
          <span>{recipient.name.display}</span>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <p className="start-message">
            Start a conversation with {recipient.name.display}
          </p>
        ) : (
          messages.map(msg => (
            <div 
              key={msg._id}
              className={`message ${msg.sender === currentUserId ? 'sent' : 'received'}`}
            >
              {msg.content}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
        />
        <button type="submit" disabled={sending || !message.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default DirectMessage;
