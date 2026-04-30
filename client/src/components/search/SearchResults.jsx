import UserResultCard from './UserResultCard';
import EmptyState from './EmptyState';

const SearchResults = ({ results, loading, error, searched, query }) => {
  if (!searched || query.length < 2) return null;
  if (loading) return null;

  if (error) {
    return (
      <div className="search-results">
        <div className="search-results__error">{error}</div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="search-results">
        <EmptyState
          title="No users found"
          sub={`No matches for "${query}". Try a different username.`}
        />
      </div>
    );
  }

  return (
    <div className="search-results">
      <p className="search-results__count">
        {results.length} result{results.length !== 1 ? 's' : ''}
      </p>
      <div className="search-results__list">
        {results.map((user) => (
          <UserResultCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
