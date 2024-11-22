import { useState, useEffect } from 'react';
import axios from 'axios';
import './MessageWidget.css';

function MessageWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/conversations/${currentUserId}`);
        setConversations(response.data);
      } catch (err) {
        console.error('Error fetching conversations:', err);
      }
    };

    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen, currentUserId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedConversation) return;

    try {
      await axios.post(`http://localhost:3000/api/messages`, {
        conversationId: selectedConversation._id,
        sender: currentUserId,
        content: message
      });
      setMessage('');
      // Refresh conversation
      const response = await axios.get(`http://localhost:3000/api/conversations/${selectedConversation._id}`);
      setSelectedConversation(response.data);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (selectedConversation) {
      setSelectedConversation(null);
    }
  };

  return (
    <div className={`message-widget ${isOpen ? 'open' : ''}`}>
      <button className="message-widget-toggle" onClick={toggleWidget}>
        <span className="material-symbols-rounded">
          {isOpen ? 'close' : 'chat'}
        </span>
      </button>

      {isOpen && (
        <div className="message-widget-content">
          {!selectedConversation ? (
            <>
              <h3>Messages</h3>
              <div className="conversations-list">
                {conversations.map(conv => (
                  <div
                    key={conv._id}
                    className="conversation-item"
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <img 
                      src={conv.participant.profilePicture || "https://via.placeholder.com/40"} 
                      alt={conv.participant.name.display}
                    />
                    <div className="conversation-info">
                      <span className="name">{conv.participant.name.display}</span>
                      <span className="last-message">
                        {conv.lastMessage?.content || 'Start a conversation'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="conversation-view">
              <div className="conversation-header">
                <button onClick={() => setSelectedConversation(null)}>
                  <span className="material-symbols-rounded">arrow_back</span>
                </button>
                <span>{selectedConversation.participant.name.display}</span>
              </div>
              
              <div className="messages-container">
                {selectedConversation.messages?.map(msg => (
                  <div
                    key={msg._id}
                    className={`message ${msg.sender === currentUserId ? 'sent' : 'received'}`}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="message-input">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <button type="submit">
                  <span className="material-symbols-rounded">send</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MessageWidget;
