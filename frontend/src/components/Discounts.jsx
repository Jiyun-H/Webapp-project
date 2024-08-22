import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import '../styles/DiscountStyle.css'

const Discounts = () => {
    const [couponCount, setCouponCount] = useState(1);
    const navigate = useNavigate();

    const handleDecrement = () => {
        if (couponCount > 0) {
            setCouponCount(couponCount - 1);
        }
    };

    const handleIncrement = () => {
        setCouponCount(couponCount + 1);
    };

    const handlePayPalClick = async () => {
        const totalAmount = couponCount * 50;

        navigate('/success', { state: { totalAmount } });
    };

    return (
        <div className="discounts">
            <div>
                <span>Pay €50 for €60</span>
                <button>Get it now</button>
            </div>
            <div>
                <span>10% off for all desserts</span>
            </div>
            <div className="coupon-purchase">
                <span>Coupon €50 for €60</span>
                <div>
                    <button onClick={handleDecrement} disabled={couponCount === 0}>-</button>
                    <span>{couponCount}</span>
                    <button onClick={handleIncrement}>+</button>
                </div>
                <div>
                    Total: {couponCount * 50}€
                </div>
                <button onClick={handlePayPalClick}>Continue with PayPal</button>
            </div>
        </div>
    );
};

export default Discounts;
