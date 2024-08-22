import React, {useEffect, useReducer, useState} from 'react';
import { useParams } from 'react-router-dom';
import Search from '../components/Search';
import { getAll, getAllByTag, getAllTags, search } from '../services/restaurantService';
import Category from "../components/Category"; //lei
import { getCategories } from '../services/categoryService'; //lei

import Banner from '../components/Banner';
import '../styles/Banner.css';
import axios from "axios";

//初始化状态
const initialState = { restaurants: [], tags:[], categories: [] }; //lei

//管理状态，从API加载数据。 根据传入的 action 更新状态
const reducer = (state, action) => {
  switch (action.type) {
    case 'RESTAURANTS_LOADED':
      return { ...state, restaurants: action.payload };
    case 'TAGS_LOADED':
      return { ...state, tags: action.payload };
    case 'CATEGORIES_LOADED':
      return { ...state, categories: action.payload };
    default:
      return state;
  }
};

//homepage 组件
export default function HomePage() {
    //useReducer 钩子用于管理状态和派发动作。 dispatch 用于发送动作更新状态
    const [state, dispatch] = useReducer(reducer, initialState);
    const { restaurants, tags, categories } = state;
    //useParams 钩子从 URL 获取 searchTerm 和 tag 参数 --获取用户输入
    const { searchTerm, tag} = useParams();

    const [banner, setBanner] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    //useEffect 钩子在组件加载和 searchTerm 或 tag 改变时执行
    useEffect(() => {
        getAllTags().then(tags => dispatch({type:'TAGS_LOADED', payload:tags}));

        const loadedRestaurants = tag
        ? getAllByTag(tag)
        :searchTerm
        ? search(searchTerm)
        : getAll();

        loadedRestaurants.then(restaurants => dispatch({ type: 'RESTAURANTS_LOADED', payload: restaurants }));
        //loadedRestaurants.then(restaurants => dispatch({ type: 'RESTAURANTS_LOADED', payload: restaurants }));
   // },[searchTerm, tag]));


    //get category data
    getCategories().then(data => dispatch({ type: 'CATEGORIES_LOADED', payload: data }));

    const fetchBanner = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/banners/today');
            setBanner(response.data);
            setShowPopup(true);
        } catch (error) {
            console.error('Error fetching banner data:', error);
        }
    };

    fetchBanner();
  }, [searchTerm, tag]);

    const closePopup = () => setShowPopup(false);

    return (
    <>
        <Banner />
        <Search />
        <Category categories={categories} />
        {showPopup && banner && (
            <div id="popup" className="popup active">
                <div className="popup-content">
                    <img id="popupImage" className="popup-icon" src={banner.imageData} alt="Banner" />
                    <h2 id="popupTitle" className="popup-title">{banner.description}</h2>
                    <button id="closePopup" className="close-popup" onClick={closePopup}>Close</button>
                </div>
                <div id="overlay" className="overlay active" onClick={closePopup}></div>
            </div>
        )}
    </>
    );
}
