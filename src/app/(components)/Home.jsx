"use client";
import React, { useEffect, useState } from "react";
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
import axios from "axios";
import TextLoader from "@/app/(components)/TextLoader";
import Loader from "./Loader";

const Home = ({
  isLeftSidebarCollapsed,
  onSearchInitiation,
  submitPrompt,
  messages,
  searching,
  setLoading,
}) => {
  const [searched, setSearched] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchTempText, setSearchTempText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [linecount, setLineCount] = useState(1);
  const [promptLoaded, setPromptLoaded] = useState(false);
  useEffect(() => {
    getPrompts();
  }, []);
  const calculateRows = () => {
    const textarea = document.getElementById("searchTextArea"); // use the actual id of your textarea
    const lineHeight = 30; // Adjust this value based on your textarea's line-height
    const rows = Math.floor(textarea.scrollHeight / lineHeight);

    setLineCount(Math.min(rows, 10));
  };
  const getPrompts = () => {
    // setLoading(false);
    axios.get("/api/prompts").then((res) => {
      // setSuggestions(res.data.prompts);
      setAllSuggestions(res.data.prompts);
      setPromptLoaded(true);
    });
  };
  const filterAndSortData = (data) => {
    // Step 1: Group by prompt_category
    const groupedData = data.reduce((groups, item) => {
      const key = item.prompt_category;
      (groups[key] || (groups[key] = [])).push(item);
      return groups;
    }, {});
  
    // Step 2: Sort the groups based on the sum of hit_count in descending order
    const sortedGroups = Object.entries(groupedData).sort(
      ([, groupA], [, groupB]) =>
        groupB.reduce((sum, item) => sum + item.hit_count, 0) -
        groupA.reduce((sum, item) => sum + item.hit_count, 0)
    );
  
    // Step 3: Filter each group to store only two items with max hit_count
    const formattedData = sortedGroups.slice(0, 4).map(([category, group]) => ({
      category,
      data: group
        .sort((a, b) => b.hit_count - a.hit_count)
        .slice(0, 2) // Take only two items with max hit_count
        .map(({ _id, prompt_title, prompt_category, prompt_value, hit_count }) => ({
          _id,
          prompt_title,
          prompt_category,
          prompt_value,
          hit_count,
        }))
    }));
  
    return formattedData;
  }
  useEffect(() => {
    calculateRows();
  }, [searchText]);
  const getRandomCategories = () => {
    // Get unique categories
    const uniqueCategories = [
      ...new Set(allSuggestions.map((item) => item.prompt_category)),
    ];

    // Shuffle the categories
    const shuffledCategories = uniqueCategories.sort(() => Math.random() - 0.5);

    // Select the first four categories
    return shuffledCategories.slice(0, 4);
  };
  const updateCount = (data) => {
    axios.put("/api/prompts/" + data._id, {
      hit_count: data.hit_count+1,
    });
  };
  const getRandomValuesForCategory = (category) => {
    // Get values for the specified category
    const values = allSuggestions.filter(
      (item) => item.prompt_category === category
    );

    // Shuffle the values
    const shuffledValues = values.sort(() => Math.random() - 0.5);

    // Select the first two values
    return shuffledValues.slice(0, 2);
  };
  const truncateSentence = (sentence) => {
    if (sentence.length <= 100) {
      return sentence;
    }

    const truncatedSentence = sentence.substring(0, 100).trim();
    return `${truncatedSentence}...`;
  };
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
    submitPrompt(searchTitle, searchText);
    setSearchTempText(searchText);
    setSearchText("");
  };
  const icons = [
    <Image src={deal} key="icon1" alt="icon" className="home-icon" />,

    <Image src={monitor} key="icon2" alt="icon" className="home-icon" />,

    <Image src={manage} key="icon3" alt="icon" className="home-icon" />,

    <Image src={support} key="icon4" alt="icon" className="home-icon" />,
  ];
  const selectedCategories = getRandomCategories();
  return (
    <div className={`home ${isLeftSidebarCollapsed ? "collapsed" : ""}`}>
      <div
        className="container"
        style={{
          marginLeft: isLeftSidebarCollapsed ? "7%" : "12%",
          width: isLeftSidebarCollapsed ? "78%" : "72%",
        }}
      >
        {messages?.length > 0 || searching ? (
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
                <TextLoader />
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
              {/* {allSuggestions.map((card, index) => (
                <div className="icon-title-and-cards" key={index}>
                  <div className="icon-and-title">
                    {icons[index]}
                    <h3>{card.prompt_category}</h3>
                    </div>
                    <div className="cards">
                    <div className="card">
                    <p>{card.prompt_value}</p>
                    </div>
                    </div>
                    </div>
                  ))} */}
              {/* {promptLoaded ? selectedCategories.map((category,i) => (
                <div className="icon-title-and-cards" key={category}>
                  <div className="icon-and-title">
                  {icons[i]}
                    <h3>{category}</h3>
                  </div>
                  {getRandomValuesForCategory(category).map((value) => (
                    <div className="card" onClick={()=>{
                      setSearchText(value.prompt_value);
                    }} key={value._id}>
                      {truncateSentence(value.prompt_value)}
                    </div>
                  ))}
                </div>
              )) : <Loader />} */}
              {filterAndSortData(allSuggestions).map((category, i) => (
                <div className="icon-title-and-cards" key={category}>
                  <div className="icon-and-title">
                    {icons[i]}
                    <h3>{category.category}</h3>
                  </div>
                  {category.data.map((value) => (
                    <div
                      className="card"
                      onClick={() => {
                        setSearchText(value.prompt_value);
                        setSearchTitle(value.prompt_title);
                        updateCount(value);
                      }}
                      key={value._id}
                    >
                      {truncateSentence(value.prompt_value)}
                    </div>
                  ))}
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
          {searchText && suggestions.length > 0 && (
            <div
              style={{
                position: "absolute",
                bottom: "8%", // Adjust the distance from the input box
                left: "4%",
                zIndex: 1,
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                width: "92%",
                maxHeight: "40vh",
                overflow: "auto",
              }}
            >
              <ul style={{ listStyle: "none", padding: 0 }}>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #ccc",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      // submitPrompt(suggestion.prompt_value,suggestion.prompt_value);
                      // setSearchTempText(suggestion.prompt_value);

                      setSearchText(suggestion.prompt_value);
                      setSearchTitle(suggestion.prompt_title);
                      updateCount(suggestion._id);
                      setSuggestions([]);
                      // setLineCount(calculateRows());
                    }}
                  >
                    {suggestion.prompt_title}
                    {/* <span style={{
                      fontSize : '12px',
                      opacity: 0.5,

                    }}> - {suggestion.prompt_category}</span> */}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <textarea
            placeholder="Enter Message"
            rows={linecount}
            id="searchTextArea"
            onChange={(e) => {
              setSearchText(e.target.value);
              setSearchTitle(e.target.value);
              setSuggestions(() => {
                return allSuggestions.filter((fil) =>
                  fil?.prompt_title
                    ?.toLowerCase()
                    .includes(e.target.value.toLowerCase())
                );
              });
            }}
            value={searchText}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{
              height: "10%",
              fontSize: "16px",
              width: "95%",
              height: "100%",
              overflowY: "auto",
            }}
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
