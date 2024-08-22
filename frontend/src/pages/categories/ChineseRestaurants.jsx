import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/searchResults.css';
import { Link } from 'react-router-dom';
import Search from '../../components/Search';
import SortCategory from './SortCategory';

const ChineseRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOptions, setSortOptions] = useState({});

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/restaurants/type/chinese', {
          params: { ...sortOptions }
         });
        setRestaurants(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [sortOptions]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleSortChange = (options) => {
    setSortOptions(options);
};

  return (
		<div className="results">
    <Search/>
		<h1>Chinese Restaurants</h1 >
    <SortCategory onSortChange={handleSortChange} />
		<ul>
			{restaurants.map((result) => (
			<li key={result._id} className="result">
				<Link style={{ textDecoration:'none'}} to={`http://localhost:3001/${result.owner}`}>
				<img src={result.img} alt={result.name}  className="restaurant-image"/>
				<h2 className="center">{result.name}</h2> 
				<p className="rating">{result.rating}<span> / 5</span></p>
				<p className="center">{result.description}</p>
				{/*<p className="center">{result.price} € per person</p>*/}
				<p className="center">{result.priceRange}</p>
				<p className="center">{result.numReviews}<span> reviews</span></p>
				</Link>
			</li>
			))}
		</ul>
		</div>
  );
};

export default ChineseRestaurants;
