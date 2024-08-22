import React, { useState, useEffect } from "react";
import "../styles/category.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/categories"
        );
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching categories: {error.message}</p>;

  return (
    <div className="categories">
      <h2>Categories</h2>
      <div className="categories-box">
        <ul>
          {categories.length > 0 ? (
            categories.map((category) => (
              <li key={category._id} className="category">
                <Link style={{ textDecoration: "none" }} to={category.link}>
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="category-image"
                  />
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </Link>
              </li>
            ))
          ) : (
            <p>No categories available</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Category;
