import React from 'react'
import "../Styles/JsonTable.css"

const JsonTable = ({ jsonData }) => {
  return (
    <div className="json-table-container">
      <table className="data-table">
        <thead>
          <tr>
            {Object.keys(jsonData[0]).map((key, index) => (
              <th key={index}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jsonData.map((item, index) => (
            <tr key={index}>
              {Object.values(item).map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default JsonTable