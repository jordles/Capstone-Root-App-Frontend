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
        const response = await axios.get(`http://localhost:3000/api/messages/conversation?user1=${currentUserId}&user2=${recipient._id}`);
        setMessages(response.data);
        scrollToBottom();
      } catch (err) {
        // It's okay if there are no messages yet
        if (err.response?.status !== 404) {
          console.error('Error fetching messages:', err);
        }
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
      setMessages(prev => [...prev, response.data]);
      
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

      <div className="direct-message-content">
        <div className="messages-container">
          {messages.length === 0 ? (
            <p className="start-message">
              Start a conversation with {recipient.name.display}
            </p>
          ) : (
            messages.map(msg => (
              <div 
                key={msg._id}
                className={`message ${msg.sender._id === currentUserId ? 'sent' : 'received'}`}
              >
                {msg.content}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={sending}
        />
        <button type="submit" disabled={sending || !message.trim()}>
          <span className="material-symbols-rounded">send</span>
        </button>
      </form>
    </div>
  );
}

export default DirectMessage;
