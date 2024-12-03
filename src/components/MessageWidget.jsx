import { useState, useEffect } from 'react';
import axios from 'axios';
import DirectMessage from './messages/DirectMessage';
import './MessageWidget.css';

function MessageWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageUpdate, setMessageUpdate] = useState(0);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchConversations = async () => {
      if (!isOpen || !currentUserId) return;
      
      setLoading(true);
      try {
        const response = await axios.get(`https://capstone-root-app-backend.onrender.com/api/messages/conversations/${currentUserId}`);
        const userIds = response.data;

        const conversationsData = await Promise.all(
          userIds.map(async (userId) => {
            try {
              const userResponse = await axios.get(`https://capstone-root-app-backend.onrender.com/api/users/${userId}`);
              const messagesResponse = await axios.get(
                `https://capstone-root-app-backend.onrender.com/api/messages/conversation/${currentUserId}/${userId}`
              );
              
              const messages = messagesResponse.data;
              const lastMessage = messages[0];

              return {
                ...userResponse.data,
                lastMessage: lastMessage
              };
            } catch (err) {
              console.error('Error fetching conversation details:', err);
              return null;
            }
          })
        );

        const validConversations = conversationsData
          .filter(conv => conv !== null)
          .sort((a, b) => {
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
          });

          console.log('Valid conversations:', validConversations);
        setConversations(validConversations);
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [isOpen, currentUserId, messageUpdate]);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (selectedUser) {
      setSelectedUser(null);
    }
  };

  const handleMessageSent = () => {
    setMessageUpdate(prev => prev + 1); // Trigger conversation refresh
  };

  // This function will be called from the profile page
  window.startNewMessage = (recipient) => {
    setSelectedUser(recipient);
    setIsOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
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
        <>
          {selectedUser && (
            console.log(selectedUser),
            <DirectMessage
              recipient={selectedUser}
              onClose={() => setSelectedUser(null)}
              onMessageSent={handleMessageSent}
            />
          )}
          <div className="message-widget-content">
            <h3>Messages</h3>
            <div className="conversations-list">
              {loading ? (
                <div className="loading">Loading conversations...</div>
              ) : conversations.length > 0 ? (
                conversations.map(conv => (
                  console.log(conv),
                  <div
                    key={conv._id}
                    className="conversation-item"
                    onClick={() => setSelectedUser(conv)}
                  >
                    {/* <ProfilePic user={conv} /> */}
                    <img 
                      src={conv.profilePicture || "https://via.placeholder.com/40"} 
                      alt={conv.name.display}
                    />
                    <div className="conversation-info">
                      <div className="conversation-header">
                        <span className="name">{conv.name.display}</span>
                        <span className="handle">@{conv.name.handle}</span>
                        {conv.lastMessage && (
                          <span className="time">{formatDate(conv.lastMessage.createdAt)}</span>
                        )}
                      </div>
                      <span className="last-message">
                        {conv.lastMessage ? 
                          (conv.lastMessage.sender === localStorage.getItem('userId') ? 
                            `You: ${conv.lastMessage.content}` : 
                            `${conv.name.display}: ${conv.lastMessage.content}`
                          ) : 'Start a conversation'
                        }
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-conversations">
                  <p>No conversations yet</p>
                  <p className="hint">Click the message button on someone's profile to start chatting!</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MessageWidget;
