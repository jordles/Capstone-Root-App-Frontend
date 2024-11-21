import './PostButton.css';

function PostButton({ icon, label, onClick, type = 'button', disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="post-button"
      disabled={disabled}
      title={label}
    >
      <span className="material-symbols-rounded">{icon}</span>
    </button>
  );
}

export default PostButton;
