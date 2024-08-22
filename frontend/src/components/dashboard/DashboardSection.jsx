import React from "react";
import "../../styles/dashboard/DashboardSection.css";

export default function DashboardSection({ title, children }) {
  return (
    <div className="dashboard-section">
      <h2>{title}</h2>
      <div className="section-content">{children}</div>
    </div>
  );
}
