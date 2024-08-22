import { sample_restaurant, sample_tags } from "../RestaurantsData";
import chineseFood from "../assets/seen.png";

export const getAll = async() => sample_restaurant;

export const search = async(searchTerm) => 
    sample_restaurant.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

export const getAllTags = async() => sample_tags;

export const getAllByTag = async tag => {
    if (tag === 'All') return getAll();
    return sample_restaurant.filter(item => item.tags?.includes(tag));
  };

// restaurantService.js

//get all ChineseRestaurant from server
/* export const getAllChineseRestaurants = async () => {
  // '/api/restaurants/chinese' 是一个假设的 API 端点。这个端点应该在服务器上实现，并负责返回所有中国餐厅的相关数据
  const response = await fetch('/api/restaurants/chinese');
  const data = await response.json();
  return data;
}; */

//获取中国餐厅数据，从服务器获取失败时，掉用示例数据
export const getAllChineseRestaurants = async () => {
  try {
    // 尝试从服务器获取数据
    const response = await fetch('/api/restaurants/chinese');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    // 如果获取数据失败，使用示例数据
    console.error('Failed to fetch Chinese restaurants:', error);
    return sampleChineseRestaurants;
  }
};

//中国餐厅示例数据，在请求失败或数据为空时使用示例数据
const sampleChineseRestaurants = [
  {
    id: 1,
    name: 'Chinese Food',
    imageUrl: chineseFood ,     /* '/images/chinese.jpg', */
    description: 'Tasty Chinese dishes.',
  },
  {
    id: 2,
    name: 'Sichuan Spice',
    imageUrl: '/images/sichuan_spice.jpg',
    description: 'Spicy and flavorful Sichuan dishes.',
  },
  {
    id: 3,
    name: 'Beijing Express',
    imageUrl: '/images/beijing_express.jpg',
    description: 'Fast and delicious Beijing street food.',
  },
  {
    id: 4,
    name: 'Shanghai Bistro',
    imageUrl: '/images/shanghai_bistro.jpg',
    description: 'Traditional Shanghai flavors in a cozy setting.',
  },
];


