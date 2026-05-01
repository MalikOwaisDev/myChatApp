const MessagePaginationLoader = () => (
  <div className="msg-pagination-loader" aria-label="Loading older messages">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className={`msg-pagination-loader__item${i % 2 === 0 ? ' msg-pagination-loader__item--right' : ''}`}
      />
    ))}
  </div>
);

export default MessagePaginationLoader;
