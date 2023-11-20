"use client"
import React from "react";
import "../Styles/HomeSearch.css";
import DealData from "../../Data/Deal.json";
import PyramidChart from "./Pyramid";
import Staffdata from "../../Data/Staff.json";

const DealSheet = ({ isLeftSidebarCollapsed }) => {
  const data = DealData.table;
  const staffdata = Staffdata.table;
  return (
    <div className={`home ${isLeftSidebarCollapsed ? "collapsed" : ""}`}>
      <div
        className="container"
        style={{
          marginLeft: isLeftSidebarCollapsed ? "12%" : "17%",
          width: isLeftSidebarCollapsed ? "73%" : "68%",
        }}
      >
        <div className="chat-header">
          <div className="circle-letter">L</div>
          <p>Provide a brief summary of the project's objectives and scope.</p>
        </div>
        <div className="deal-container">
          <div>
            <div className="deal-header">Project's objectives and scope.</div>
            <div style={{ display: "flex" }}>
              <div className="costing">
                <div className="costing-header">Costing - FTE</div>
                <div className="maincost-content">
                  <div className="left-contents">
                    <p style={{ paddingBottom: "5px" }}>Project Name: </p>
                    <p>Project Type: </p>
                    <p>Location: </p>
                    <p>Start Date: </p>
                    <p>End Date:</p>
                    <p>Project Manager:</p>
                  </div>
                </div>
              </div>
              <div className="table-costing">
                <div className="FTE-header">Costing - FTE</div>
                <div className="FTE-header2">
                  Table shows that data of costing Percentage
                </div>
                <div style={{ paddingTop: "5px" }}>
                  {data.length > 0 && (
                    <table>
                      <thead>
                        <tr>
                          {Object.keys(data[0]).map((key) => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((item, index) => (
                          <tr key={index}>
                            {Object.values(item).map((value, innerIndex) => (
                              <td key={innerIndex}>{value}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <div className="costing">
                <div className="FTE-header">Pyramid Summary</div>
                <div className="FTE-header2">
                  Chart that simplifies the representation of Staff hierarchical
                  data
                </div>
                <div className="maincost-content">
                  <div className="left-contents">
                    <PyramidChart />
                  </div>
                </div>
              </div>
              <div className="table-costing">
                <div className="FTE-header">Staffing - FTE</div>
                <div className="FTE-header2">
                  Table shows that data of staffing Percentage
                </div>
                <div
                  style={{ paddingTop: "5px" }}
                  className="deal-table bottom-table"
                >
                  {staffdata.length > 0 && (
                    <table>
                      <thead>
                        <tr>
                          {Object.keys(staffdata[0]).map((key) => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {staffdata.map((item, index) => (
                          <tr key={index}>
                            {Object.values(item).map((value, innerIndex) => (
                              <td key={innerIndex}>{value}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealSheet;
