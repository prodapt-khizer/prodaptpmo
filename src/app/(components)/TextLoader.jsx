import React from "react";
import "@/app/Styles/TextLoader.css";
const TextLoader = () => {
  return (
    <div className="loader slide">
      <span className="loader__dot slide__one"></span>
      <span className="loader__dot"></span>
      <span className="loader__dot"></span>
      <span className="loader__dot slide__two"></span>
    </div>
  );
};

export default TextLoader;
