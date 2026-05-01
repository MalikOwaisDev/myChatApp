const TypingIndicator = ({ name }) => (
  <div className="typing-indicator">
    <div className="typing-indicator__dots">
      <span />
      <span />
      <span />
    </div>
    <span className="typing-indicator__text">{name || 'Someone'} is typing</span>
  </div>
);

export default TypingIndicator;
