import React from "react";

const Seat = ({ selected, onClick }) => (
  <svg
    onClick={onClick}
    viewBox="0 0 2000 2000"
    style={{
      enableBackground: "new 0 0 2000 2000",
      cursor: "pointer",
      fill: selected ? "#00ff00" : "none",
      stroke: selected ? "#00ff00" : "#000",
      strokeWidth: "66",
      strokeMiterlimit: "10",
    }}
  >
    <path d="M1929,1944.3H66.2V403.2c0-177.7,144-321.7,321.7-321.7h1219.4c177.7,0,321.7,144,321.7,321.7V1944.3z" />
  </svg>
);

export default Seat;
