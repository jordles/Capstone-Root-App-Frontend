import './TrendingTopics.css';

function TrendingTopics() {
  const topics = [
    'AI',
    'Politics',
    'Sustainability',
    'Health',
    'SoftwareEngineering'
  ];

  return (
    <div className="trending-card">
      <h3>Trending Topics</h3>
      <ul>
        {topics.map((topic, index) => (
          <li key={index}>#{topic}</li>
        ))}
      </ul>
    </div>
  );
}

export default TrendingTopics;
