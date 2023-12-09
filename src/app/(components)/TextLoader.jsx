import React from "react";
import "@/app/Styles/TextLoader.css";
const TextLoader = () => {
  return (
    <div class="loader slide">
      <span class="loader__dot slide__one"></span>
      <span class="loader__dot"></span>
      <span class="loader__dot"></span>
      <span class="loader__dot slide__two"></span>
    </div>
  );
};

export default TextLoader;
