"use client";
import React, { useState } from "react";
import "../Styles/Home.css";
import { VscSend } from "react-icons/vsc";

import star from "../Assets/Home-png/Star.png";
import fallingStar from "../Assets/Home-png/Falling star.png";

import deal from "../Assets/Home-svg/Dealsheet.svg";
import monitor from "../Assets/Home-svg/Monitoring.svg";

import manage from "../Assets/Home-svg/Management.svg";

import support from "../Assets/Home-svg/Support.svg";
import Image from "next/image";
import OpenAIResponse from "@/app/(components)/openAiResponse";

const Home = ({
  isLeftSidebarCollapsed,
  onSearchInitiation,
  submitPrompt,
  messages,
  searching,
}) => {
  const [searched, setSearched] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchTempText, setSearchTempText] = useState("");

  const cards = [
    {
      title: "DEAL - SHEET",
      description1:
        "Prepare cost revenue for 4 members in offshore for fixed bit project",
      description2:
        "Prepare cost revenue for 4 members in offshore for fixed T&M",
    },
    {
      title: "PROJECT MONITORING & REPORTING",
      description1:
        "Provide a brief summary of the project's objectives and scope.",
      description2: "Include the project's start and end dates.",
    },
    {
      title: "INTELLIGENT DECISION SUPPORT",
      description1:
        "Identify potential risks and issues that have arisen or been mitigated",
      description2:
        "Provide updates on risk assessments and risk response strategies.",
    },
    {
      title: "SMART RESOURCE MANAGEMENT",
      description1:
        "Track the performance of your project using key performance indicators.",
      description2:
        "Predictively improve the management of Software and equipment resources",
    },
  ];

  const handleSearch = () => {
    submitPrompt(searchText);
    setSearchTempText(searchText);
    setSearchText("");
  };
  const icons = [
    <Image src={deal} key="icon1" alt="icon" className="home-icon" />,

    <Image src={monitor} key="icon2" alt="icon" className="home-icon" />,

    <Image src={manage} key="icon3" alt="icon" className="home-icon" />,

    <Image src={support} key="icon4" alt="icon" className="home-icon" />,
  ];

  return (
    <div className={`home ${isLeftSidebarCollapsed ? "collapsed" : ""}`}>
      <div
        className="container"
        style={{
          marginLeft: isLeftSidebarCollapsed ? "7%" : "12%",
          width: isLeftSidebarCollapsed ? "78%" : "72%",
        }}
      >
        {(messages?.length > 0 || searching) ? (
          <div className="chat_data">
            {/* <HomeSearch isLeftSidebarCollapsed={isLeftSidebarCollapsed} /> */}
            {messages.map((data) => {
              return (
                <div className="chat_set">
                  {data.prompt.map((res, i) => {
                    return (
                      <>
                        <p className="question">{res}</p>
                        <OpenAIResponse response={data.response[i]} />
                      </>
                    );
                  })}

                  {/* <p className="answer">{data.response[0]}</p> */}
                </div>
              );
            })}
            {searching && (
              <div className="chat_set">
                <p className="question">{searchTempText}</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div
              className="container-heading"
              style={{
                marginTop: isLeftSidebarCollapsed ? "5%" : "5%",
              }}
            >
              <Image src={star} alt="Star" className="star-image" />

              <div className="container-header1">
                Your AI-powered assistant for
              </div>
              <Image
                src={fallingStar}
                alt="Star"
                className="fallingStar-image"
              />
              <div className="container-header2">Project Management AI</div>
              <div className="container-header3">
                Manage better projects with less time and resources.
              </div>
            </div>

            <div className="icons-titles-and-cards">
              {cards.map((card, index) => (
                <div className="icon-title-and-cards" key={index}>
                  <div className="icon-and-title">
                    {icons[index]}
                    <h3>{card.title}</h3>
                  </div>
                  <div className="cards">
                    <div className="card">
                      <p>{card.description1}</p>
                    </div>
                    <div className="card">
                      <p>{card.description2}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Search bar */}
        <div
          className="container-search-bar"
          style={{ marginTop: isLeftSidebarCollapsed ? "2%" : "2%" }}
        >
          <input
            type="text"
            placeholder="Enter Message"
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            value={searchText}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <div className="container-search-icon" onClick={handleSearch}>
            <VscSend size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
