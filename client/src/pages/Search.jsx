import { useState, useEffect } from 'react';
import SearchInput from '../components/search/SearchInput';
import SearchResults from '../components/search/SearchResults';
import { searchUsersApi } from '../services/search.service';
import useDebounce from '../hooks/useDebounce';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      setSearched(false);
      setError('');
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await searchUsersApi(debouncedQuery.trim());
        if (!cancelled) { setResults(data); setSearched(true); }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Search failed. Please try again.');
          setSearched(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  return (
    <div className="search-page">
      <div className="search-orb search-orb--1" aria-hidden="true" />
      <div className="search-orb search-orb--2" aria-hidden="true" />
      <div className="search-container">
        <header className="search-header">
          <h1 className="search-header__title">Find People</h1>
          <p className="search-header__sub">Search for users by username</p>
        </header>
        <SearchInput value={query} onChange={setQuery} loading={loading} />
        {query.length > 0 && query.length < 2 && (
          <p className="search-hint">Type at least 2 characters to search</p>
        )}
        <SearchResults
          results={results}
          loading={loading}
          error={error}
          searched={searched}
          query={debouncedQuery.trim()}
        />
      </div>
    </div>
  );
};

export default Search;
