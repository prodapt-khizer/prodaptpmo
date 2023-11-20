// DualSidebar.js
"use client";
import React, { useEffect, useState } from "react";
import { FiSearch, FiBookmark } from "react-icons/fi";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { RiHome6Fill, RiSettings3Line } from "react-icons/ri";
import { LuCompass } from "react-icons/lu";
import { AiOutlinePlus } from "react-icons/ai";
import "../Styles/Sidebar.css";
import "../Styles/Home.css";
import chatData from "../../Data/chatData.json";
import Logo from "./Logo";
import Home from "./Home";

import HomeSearch from "./HomeSearch";
import { useRouter } from "next/navigation";
import axios from "axios";

const DualSidebar = () => {
  const [isLeftSidebarCollapsed, setLeftSidebarCollapsed] = useState(true);
  const router = useRouter();
  const [isHomeActive, setHomeActive] = useState(true);
  const [isCompassActive, setCompassActive] = useState(false);
  const [isSettingsActive, setSettingsActive] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [allTitles, setAllTitles] = useState([]);
  const [title, setTitle] = useState("");
  const [generating, setGenerating] = useState(false);

  const toggleLeftSidebar = () => {
    setLeftSidebarCollapsed(!isLeftSidebarCollapsed);
  };
  useEffect(() => {
    getMessages()
  }, []);
  const handleItemClick = (itemName) => {
    setHomeActive(itemName === "home");
    setCompassActive(itemName === "compass");
    setSettingsActive(itemName === "settings");
  };

  const goToHome = () => {
    router.push("/");
  };

  const goToComp = () => {
    router.push("/side");
  };
  const handleSearchInitiation = () => {};
  const getMessages = () => {
    axios.get("/api/messages").then((res) => {
      setAllTitles([...new Set(res.data.messages.map((obj) => obj.title))]);
      setDataLoaded(true);
    });
  };
  const getOneMessage = (data) => {
    axios.get("/api/messages/" + encodeURIComponent(data)).then((res) => {
      setMessages(res.data.messages);
      setTitle(data)
    }).catch((error)=>{
      console.log("error ",error);
    })
  }
  const callOpenAi = (data) => {
    setGenerating(true);
    axios.get("http://127.0.0.1:9001/qa?prompt=" + data).then((ress) => {
      if (title === "") {
        axios.post("api/messages", {
          title: data,
          prompt: [data],
          response: [ress.data],
          user: "Khizer Hussain",
          edited: false,
        });
        getOneMessage(data);
        setTitle(data);
        getMessages();
        setGenerating(false);
      } else {
        axios.get("/api/messages/" + encodeURIComponent(title)).then(res => res.data.messages[0]).then((res) => {
          axios.put("/api/messages/" + res._id, {
            title: res.title,
            prompt: [...res.prompt,data],
            response: [...res.response, ress.data],
            user: "Khizer Hussain",
            edited: false,
          });
        });
        getOneMessage(title);
        getMessages();
        setGenerating(false);
      }
      // setMessages((prev) => {
        //   [
        //     ...prev,
      //     {
      //       title: data,
      //       prompt: [data],
      //       response: [res.data.resp_1],
      //       user: "Khizer Hussain",
      //       edited: false,
      //     },
      //   ];
      // });
    });
  };
  const newChat = () => {
    setMessages([]);
    setDataLoaded(false);
    setTitle("");
  };

  return (
    <>
      <div className="dual-sidebar">
        {/* Left Sidebar */}
        <div className={`sidebar ${isLeftSidebarCollapsed ? "collapsed" : ""}`}>
          <div className="content">
            <Logo isCollapsed={isLeftSidebarCollapsed} />

            <div className="menu-item-container">
              {/* Home */}
              <div
                className={`sidebar-item ${isHomeActive ? "active" : ""}`}
                onClick={() => {
                  handleItemClick("home");
                  goToHome();
                }}
              >
                <div className="sidebar-item-content">
                  <div className="sidebar-item-box">
                    <RiHome6Fill size={18} />
                  </div>
                  <span
                    style={{
                      display: isLeftSidebarCollapsed ? "none" : "inline-block",
                      fontSize: "12px",
                    }}
                  >
                    Home
                  </span>
                </div>
              </div>

              {/* Compass */}
              <div
                className={`sidebar-item ${isCompassActive ? "active" : ""}`}
                onClick={() => {
                  handleItemClick("compass");
                  goToComp();
                }}
              >
                <div className="sidebar-item-content">
                  <div className="sidebar-item-box">
                    <LuCompass size={18} />
                  </div>
                  <span
                    style={{
                      display: isLeftSidebarCollapsed ? "none" : "inline-block",
                      fontSize: "12px",
                    }}
                  >
                    Compass
                  </span>
                </div>
              </div>

              {/* Settings */}
              <div
                className={`sidebar-item ${isSettingsActive ? "active" : ""}`}
                onClick={() => handleItemClick("settings")}
              >
                <div className="sidebar-item-content">
                  <div className="sidebar-item-box">
                    <RiSettings3Line size={18} />
                  </div>
                  <span
                    style={{
                      display: isLeftSidebarCollapsed ? "none" : "inline-block",
                      fontSize: "12px",
                    }}
                  >
                    Settings
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="toggle-btn-container" onClick={toggleLeftSidebar}>
            {isLeftSidebarCollapsed ? <BsChevronRight /> : <BsChevronLeft />}
          </div>
        </div>

        {/* Separator Line */}
        <div
          className={`separator-line ${
            isLeftSidebarCollapsed ? "collapsed" : ""
          }`}
        />

        {/* Right Sidebar */}
        <div
          className={`right-sidebar ${
            isLeftSidebarCollapsed ? "collapsed" : ""
          }`}
        >
          <div className="content">
            {/* Chatbot Contents */}
            <span className="activity-text">Activity</span>
            <div className="history_handler">
              <div className="chatbot-contents">
                <div className="search-bar">
                  <input type="text" placeholder="Search..." />
                  <FiSearch size={12} />
                </div>

                {/* Chat Categories */}
                {/* <div className="chat-categories">
                {chatData.chats.map((chatCategory) => (
                  <div key={chatCategory.id} className="chat-category">
                    <span className="category-title">{chatCategory.title}</span>
                    {chatCategory.messages.map((message) => (
                      <div key={message.id} className="chat-subcategory">
                        <div className="chatbot-item">
                          <FiBookmark size={18} />
                          <span>{message.message.substring(0, 30)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div> */}
                <div className="chat-categories">
                  {allTitles.map((data,i) => {
                    return (
                      <div key={i} className="chat-category">
                        <div key={i} className="chat-subcategory">
                          <div className="chatbot-item" onClick={()=> getOneMessage(data)}>
                            <FiBookmark size={18} />
                            <span>{data.substring(0, 30)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* New Chat Button */}
              <button className="new-chat-btn" onClick={newChat}>
                <AiOutlinePlus size={20} />
                <span>New Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Home
        isLeftSidebarCollapsed={isLeftSidebarCollapsed}
        onSearchInitiation={handleSearchInitiation}
        submitPrompt={callOpenAi}
        messages={messages}
        searching={generating}
      />
    </>
  );
};

export default DualSidebar;
