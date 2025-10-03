import React from 'react';

const GridContainer = ({ children, direction = "row", cols, className = "" }) => {
  const gridClass = cols
    ? `grid ${cols}` // Accept raw Tailwind grid cols like "grid-cols-3 gap-3"
    : direction === "row"
    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    : "grid grid-cols-1 gap-6";

  return <div className={`${gridClass} ${className ? className : "mt-14"} `}>{children}</div>;
};

export default GridContainer;
