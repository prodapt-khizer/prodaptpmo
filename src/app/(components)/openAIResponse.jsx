// OpenAIResponse.js
import React from 'react';
import '../Styles/OpenAIResponse.css'; // Import the CSS file for styling

const OpenAIResponse = ({ response }) => {
  return (
    <div className="response-container">
      <pre>
        {response}
      </pre>
    </div>
  );
};

export default OpenAIResponse;
