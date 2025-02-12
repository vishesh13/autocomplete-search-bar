import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [cachedResults, setCachedResults] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const timer = setTimeout(fetchData, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const fetchData = async () => {
    if (cachedResults[searchQuery]) {
      setSearchResults(cachedResults[searchQuery]);
    } else {
      const res = await fetch(
        `https://dummyjson.com/recipes/search?q=${searchQuery}`
      );
      const data = await res.json();

      setSearchResults(data?.recipes);
      setCachedResults((prev) => ({ ...prev, [searchQuery]: data?.recipes }));
    }
  };

  const highlightMatch = (text) => {
    if (!searchQuery) return text;

    const lowerSearchText = text.toLowerCase();
    const lowerQuery = searchQuery.toLowerCase();

    const startIndex = lowerSearchText.indexOf(lowerQuery);

    if (startIndex === -1) return text; // No match found

    const beforeMatch = text.slice(0, startIndex);
    const match = text.slice(startIndex, startIndex + searchQuery.length);
    const afterMatch = text.slice(startIndex + searchQuery.length);

    return (
      <>
        {beforeMatch}
        <span className="highlight">{match}</span>
        {afterMatch}
      </>
    );
  };

  return (
    <div className="App">
      <h1>AutoComplete SearchBar</h1>
      <input
        type="text"
        value={searchQuery}
        onBlur={() => setShowSearchResults(false)}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setShowSearchResults(true)}
        className="search-input"
      />
      {showSearchResults && (
        <div className="search-results-container">
          {searchResults?.map((result) => (
            <span className="search-result" key={result.id}>
              {highlightMatch(result?.name)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
