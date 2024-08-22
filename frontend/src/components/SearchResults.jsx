import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/searchResults.css';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import FilterSort from '../components/FilterSort';

const SearchResults = () => {
    const location = useLocation();
    const { term } = location.state;
    const [restaurants, setRestaurants] = useState([]);
    const [filterSortOptions, setFilterSortOptions] = useState({});

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const { data } = await axios.get('http://localhost:5001/api/restaurants/search', {
                    params: { term, ...filterSortOptions }
                });
				console.log('Search results:', data);
                setRestaurants(data);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            }
        };

        fetchRestaurants();
    }, [term, filterSortOptions]);

    const handleFilterSortChange = (options) => {
        setFilterSortOptions(options);
    };

	return (
		<div className="results">
		<h1>Search Results</h1 >
		<FilterSort onFilterSortChange={handleFilterSortChange} />
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

export default SearchResults;


