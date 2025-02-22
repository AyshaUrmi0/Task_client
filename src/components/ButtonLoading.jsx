import React from "react";

const ButtonLoading = ({ width }) => {
  return (
    <div>
      <button
        className={`btn ${width} btn-square btn-primary font-semibold text-base bg-purple-600 hover:bg-purple-700 text-white`}
      >
        <span className="loading loading-spinner"></span>
      </button>
    </div>
  );
};

export default ButtonLoading;
