import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/search.css';

const Search = (margin) => {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();

  const search = async () => {
      navigate('/search-results', { state: { term } });
  };

  return (
    <div className="container" style={{ margin }}>
      <input
        type="text"
        placeholder="Search in Foodie..."
        onChange={(e) => setTerm(e.target.value)}
        onKeyUp={(e) => e.key === 'Enter' && search()}
        value={term}
      />
      <button onClick={search}>Search</button>
    </div>
  );
};

export default Search;

