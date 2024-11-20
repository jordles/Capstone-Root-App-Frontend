import { useState, useEffect } from 'react';
import { getSessions } from '../services/api';

function SessionsList() {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getSessions();
        setSessions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) return <div>Loading sessions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="sessions-list">
      <h2>Active Sessions</h2>
      {sessions.length === 0 ? (
        <p>No active sessions found</p>
      ) : (
        <ul>
          {sessions.map((session) => (
            <li key={session._id}>
              <div>Last Active: {new Date(session.lastActive).toLocaleString()}</div>
              <div>Created: {new Date(session.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SessionsList;
