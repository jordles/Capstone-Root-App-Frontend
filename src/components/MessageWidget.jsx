import { useState, useEffect } from 'react';
import axios from 'axios';
import DirectMessage from './messages/DirectMessage';
import './MessageWidget.css';

function MessageWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchConversations = async () => {
      if (!isOpen || !currentUserId) return;
      
      setLoading(true);
      try {
        // Get all unique users you've messaged with
        const response = await axios.get(`http://localhost:3000/api/messages/conversation?user1=${currentUserId}`);
        const messages = response.data;

        // Create a map to store unique users and their last message
        const userMap = new Map();
        
        // Process each message to build conversation list
        messages.forEach(msg => {
          // Determine if the other user is the sender or recipient
          const otherUserId = msg.sender === currentUserId ? msg.recipient : msg.sender;
          
          // If we haven't seen this user before, or if this message is newer
          if (!userMap.has(otherUserId) || 
              new Date(msg.createdAt) > new Date(userMap.get(otherUserId).lastMessage.createdAt)) {
            userMap.set(otherUserId, {
              lastMessage: msg,
              _id: otherUserId
            });
          }
        });

        // Convert the map values to an array and fetch user details
        const conversationsList = await Promise.all(
          Array.from(userMap.values()).map(async (conv) => {
            try {
              // Get user details for each conversation
              const userResponse = await axios.get(`http://localhost:3000/api/users/${conv._id}`);
              return {
                ...userResponse.data,
                lastMessage: conv.lastMessage
              };
            } catch (err) {
              console.error('Error fetching user details:', err);
              return conv;
            }
          })
        );

        // Sort conversations by most recent message
        const sortedConversations = conversationsList.sort((a, b) => {
          return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
        });

        setConversations(sortedConversations);
      } catch (err) {
        // It's okay if there are no messages yet
        if (err.response?.status !== 404) {
          console.error('Error fetching conversations:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [isOpen, currentUserId]);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (selectedUser) {
      setSelectedUser(null);
    }
  };

  const handleMessageSent = () => {
    // Refresh conversations after sending a message
    const fetchConversations = async () => {
      try {
        const messagesResponse = await axios.get(`http://localhost:3000/api/messages/conversation?user1=${currentUserId}`);
        const messages = messagesResponse.data;

        const userMap = new Map();
        messages.forEach(msg => {
          const otherUserId = msg.sender === currentUserId ? msg.recipient : msg.sender;
          if (!userMap.has(otherUserId) || 
              new Date(msg.createdAt) > new Date(userMap.get(otherUserId).lastMessage.createdAt)) {
            userMap.set(otherUserId, {
              lastMessage: msg,
              _id: otherUserId
            });
          }
        });

        const conversationsList = await Promise.all(
          Array.from(userMap.values()).map(async (conv) => {
            try {
              const userResponse = await axios.get(`http://localhost:3000/api/users/${conv._id}`);
              return {
                ...userResponse.data,
                lastMessage: conv.lastMessage
              };
            } catch (err) {
              console.error('Error fetching user details:', err);
              return conv;
            }
          })
        );

        const sortedConversations = conversationsList.sort((a, b) => {
          return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
        });

        setConversations(sortedConversations);
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error('Error refreshing conversations:', err);
        }
      }
    };

    fetchConversations();
  };

  // This function will be called from the profile page
  window.startNewMessage = (recipient) => {
    setSelectedUser(recipient);
    setIsOpen(true);
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
          {selectedUser ? (
            <DirectMessage
              recipient={selectedUser}
              onClose={() => setSelectedUser(null)}
              onMessageSent={handleMessageSent}
            />
          ) : (
            <>
              <h3>Messages</h3>
              <div className="conversations-list">
                {loading ? (
                  <div className="loading">Loading conversations...</div>
                ) : conversations.length > 0 ? (
                  conversations.map(conv => (
                    <div
                      key={conv._id}
                      className="conversation-item"
                      onClick={() => setSelectedUser(conv)}
                    >
                      <img 
                        src={conv.profilePicture || "https://via.placeholder.com/40"} 
                        alt={conv.name.display}
                      />
                      <div className="conversation-info">
                        <span className="name">{conv.name.display}</span>
                        <span className="last-message">
                          {conv.lastMessage?.content || 'Start a conversation'}
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
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default MessageWidget;
