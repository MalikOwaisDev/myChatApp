const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const SearchInput = ({ value, onChange, loading }) => (
  <div className="search-input-wrap">
    <span className="search-input-wrap__icon" aria-hidden="true">
      <SearchIcon />
    </span>
    <input
      className="search-input-wrap__field"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by username..."
      autoFocus
      autoComplete="off"
      spellCheck="false"
      aria-label="Search users"
    />
    {loading ? (
      <span className="search-input-wrap__spinner" aria-label="Searching..." />
    ) : value ? (
      <button
        className="search-input-wrap__clear"
        onClick={() => onChange('')}
        aria-label="Clear search"
      >
        ×
      </button>
    ) : null}
  </div>
);

export default SearchInput;
