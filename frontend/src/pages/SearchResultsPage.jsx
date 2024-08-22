import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Search from '../components/Search';
import SearchResults from '../components/SearchResults';


const SearchResultsPage = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (location.state && location.state.results) {
      setResults(location.state.results);
    }
}, [location.state,  results]);

  return (
    <div>
      <Search />
      <SearchResults results={results}/>
    </div>
  );
};

export default SearchResultsPage;

