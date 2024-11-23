import { useState } from 'react';
import axios from 'axios';
import './DirectMessage.css';

function DirectMessage({ recipient, onClose, onConversationCreated }) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const currentUserId = localStorage.getItem('userId');

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      // First create a new conversation
      const conversationResponse = await axios.post('http://localhost:3000/api/conversations', {
        participants: [currentUserId, recipient._id]
      });

      // Then send the first message
      await axios.post('http://localhost:3000/api/messages', {
        conversationId: conversationResponse.data._id,
        sender: currentUserId,
        content: message
      });

      // Get the updated conversation with the message
      const updatedConversation = await axios.get(`http://localhost:3000/api/conversations/${conversationResponse.data._id}`);

      // Notify parent components
      onConversationCreated(updatedConversation.data);
      onClose();
    } catch (err) {
      console.error('Error creating conversation:', err);
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
        <p className="start-message">
          Start a conversation with {recipient.name.display}
        </p>
      </div>

      <form onSubmit={handleSendMessage} className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your first message..."
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
