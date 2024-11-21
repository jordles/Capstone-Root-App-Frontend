import './PostButton.css';

function PostButton({ icon, label, onClick, type = 'button', disabled = false, className = 'post-button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled}
      title={label}
    >
      <span className="material-symbols-rounded">{icon}</span>
    </button>
  );
}

export default PostButton;
