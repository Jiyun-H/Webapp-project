import React from "react";
import "../../styles/dashboard/customer/PointsComponent.css";

function PointsComponent({ points = [] }) {
  return (
    <div className="points-card">
      <h2>My Points</h2>

      <span className="points-value">{points} P</span>
    </div>
  );
}

export default PointsComponent;
