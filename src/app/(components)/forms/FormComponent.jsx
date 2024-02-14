import React, { useState } from 'react'
import "../../Styles/FormComponent.css"

const FormComponent = ({ formData, onSubmit, onCancel, isSubmitted }) => {
    const [editedFormData, setEditedFormData] = useState(formData);

    const handleChange = (e, fieldName) => {
      const { value } = e.target;
      setEditedFormData(prevState => ({
        ...prevState,
        [fieldName]: value
      }));
    };
  
    const handleSubmit = () => {
      onSubmit(editedFormData);
    };
    
    const handleCancel = () => {
      onCancel();
    };
  
    return (
      <div className="form-container">
        {Object.keys(formData).map(fieldName => (
          <div key={fieldName} className="form-field">
            <label htmlFor={fieldName}>{fieldName}</label>
            <input
              type="text"
              id={fieldName}
              value={editedFormData[fieldName]}
              onChange={e => handleChange(e, fieldName)}
              disabled={isSubmitted}
            />
          </div>
        ))}
        {!isSubmitted && <div className="form-actions">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>}
      </div>
    );
}

export default FormComponent