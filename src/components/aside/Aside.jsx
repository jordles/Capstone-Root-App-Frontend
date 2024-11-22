import TrendingTopics from './TrendingTopics';
import FriendSuggestions from './FriendSuggestions';
import './Aside.css';

function Aside() {
  return (
    <aside className="aside-container">
      <TrendingTopics />
      <FriendSuggestions />
    </aside>
  );
}

export default Aside;
