import PostButton from './PostButton';
import './PostButton.css';
import Card from './Card';
function OptionsPicker({ onEdit, onDelete }) {
  return (
    <Card style={{ marginBottom: 0, backgroundColor: '#222222', boxShadow: 'none' }}>
      <PostButton
        icon="edit"
        label="Edit post"
        className="highlight-button"
        onClick={onEdit}
      />
      <PostButton
        icon="delete"
        label="Delete post"
        className="delete-button"
        onClick={onDelete}
      />
    </Card>
  );
}

export default OptionsPicker;