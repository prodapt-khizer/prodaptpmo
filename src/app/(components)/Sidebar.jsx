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
import Loader from "@/app/(components)/Loader";
import { useRouter } from "next/navigation";
import axios from "axios";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const DualSidebar = () => {
  const [isLeftSidebarCollapsed, setLeftSidebarCollapsed] = useState(true);
  const router = useRouter();
  const [isHomeActive, setHomeActive] = useState(true);
  const [isCompassActive, setCompassActive] = useState(false);
  const [isSettingsActive, setSettingsActive] = useState(false);
  const [websocket, setWebsocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState("");
  const [titleText, setTitleText] = useState("");
  const [allTitles, setAllTitles] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [qn, setQn] = useState("");
  const [ans, setAns] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [objectID, setObjectID] = useState("");

  useEffect(() => {
    if (websocket) {
      // WebSocket connection already established
      return;
    }

    const uri = "ws://34.67.160.218:8765/";
    // const uri = "ws://localhost:8765";
    const ws = new W3CWebSocket(uri);

    ws.onopen = () => {
      console.log('Connected to server. Start chatting! Type "quit" to exit.');
      setWebsocket(ws);
    };

    ws.onmessage = (event) => {
      console.log(`Received: ${event.data}`);
      setAns(event.data);
    };

    ws.onclose = () => {
      console.log("Connection closed.");
      setWebsocket(null); // Reset WebSocket state when connection is closed
    };

    return () => {
      if (websocket) {
        websocket.close();
        setWebsocket(null); // Reset WebSocket state when component unmounts
      }
    };
  }, [websocket]);
  const getOneMessage = (data) => {
    axios
      .get("/api/messages/" + encodeURIComponent(data), {
        timeout: 50000,
      })
      .then((res) => {
        setMessages(res.data.messages);
        setTitle(data);
        getMessages();
        setQn("");
        setAns("");
        setTitle(res.data.messages[0].title);
      })
      .catch((error) => {
        console.log("error ", error);
      });
  };
  const sendMessage = (message) => {
    if (
      websocket &&
      websocket.readyState === WebSocket.OPEN &&
      message[message.length - 1].trim() !== ""
    ) {
      console.log("sending message ", message);
      websocket.send(message);

      if (message[message.length - 1].toLowerCase() === "quit") {
        websocket.close();
      }
    }
  };

  const toggleLeftSidebar = () => {
    setLeftSidebarCollapsed(!isLeftSidebarCollapsed);
  };
  useEffect(() => {
    getMessages();
  }, []);
  useEffect(() => {
    console.log(allTitles);
  }, [allTitles]);
  const handleItemClick = (itemName) => {
    setHomeActive(itemName === "home");
    setCompassActive(itemName === "compass");
    setSettingsActive(itemName === "settings");
  };
  const getMessages = () => {
    axios
      .post("/api/messages/" + localStorage.getItem("user"), {
        timeout: 5000,
      })
      .then((res) => {
        setAllTitles(res.data.messages);
        setDataLoaded(true);
      });
  };
  const goToHome = () => {
    router.push("/");
  };

  const goToComp = () => {
    router.push("/side");
  };
  const handleSearchInitiation = () => {};

  const callOpenAi = (ti, data) => {
    console.log(ti, "data ", data);
    if (objectID === "") {
      console.log("out obj ", objectID);
      axios
        .post("api/messages", {
          title: "",
          prompt: [],
          response: [],
          user: localStorage.getItem("user"),
          edited: false,
        })
        .then((res) => {
          setGenerating(true);
          setQn(data);
          setTitleText(ti);
          sendMessage(res.data.response._id);
          sendMessage(data);
          setObjectID(res.data.response._id);
        });
    } else {
      console.log("inside obj ", objectID);
      setGenerating(true);
      setQn(data);
      sendMessage(data);
    }

    // if (title === "") {
    // } else {
    //   sendMessage([...messages[0].prompt, data]);
    // }
  };
  useEffect(() => {
    if (objectID !== "") {
      getOneMessage(objectID);
    }
    if (qn != "" && ans != "") {
      // if (title === "") {
      //   console.log("test from page ", qn, title);
      //   axios.post("api/messages", {
      //     title: titleText,
      //     prompt: [qn],
      //     response: [ans],
      //     user: "Khizer Hussain",
      //     edited: false,
      //   });
      //   getOneMessage(qn);
      //   // getMessages();
      //   setGenerating(false);
      // } else {
      axios
        .get("/api/messages/" + encodeURIComponent(objectID))
        .then((res) => res.data.messages[0])
        .then((res) => {
          axios
            .put("/api/messages/" + res._id, {
              title: titleText || res.title,
              prompt: [...res.prompt, qn],
              response: [...res.response, ans],
              user: res.user,
              edited: false,
            })
            .then(() => {
              getOneMessage(objectID);
              setGenerating(false);
            });
        });
      // getMessages();
      // }
      // setMessages((prevData) => {
      //   const lastIndex = prevData.length > 1 ? prevData.length - 1 : 0;
      //   const updatedData = [...prevData];
      //   updatedData[lastIndex] = {
      //     ...updatedData[lastIndex],
      //     title: updatedData[lastIndex]?.title || titleText,
      //     _id: "",
      //     user: updatedData[lastIndex]?.user || "Khizer Hussain",
      //     edited: updatedData[lastIndex]?.edited || false,
      //     prompt: updatedData[lastIndex]?.prompt ? [...updatedData[lastIndex]?.prompt, qn]: [qn],
      //     response: updatedData[lastIndex]?.response ? [...updatedData[lastIndex]?.response, ans] : [ans],
      //   };
      //   return updatedData;
      // });
      // setMessages((prev) => [
      //   {
      //     title: titleText,
      //     _id: "",
      //     user: "Khizer Hussain",
      //     edited: false,
      //     prompt: [...prev[0]?.prompt, qn],
      //     response: [...prev[0]?.response, ans],
      //   },
      // ]);
    }
  }, [ans]);
  useEffect(() => {
    console.log("title ", title);
  }, [title]);
  useEffect(() => {
    console.log("messages ", messages);
  }, [messages]);
  const newChat = () => {
    setMessages([]);
    setTitle("");
    setTitleText("");
    sendMessage(["quit"]);
    setObjectID("");
  };
  if (dataLoaded) {
    return (
      <>
        <div className="dual-sidebar">
          {/* Left Sidebar */}
          <div
            className={`sidebar ${isLeftSidebarCollapsed ? "collapsed" : ""}`}
          >
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
                        display: isLeftSidebarCollapsed
                          ? "none"
                          : "inline-block",
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
                        display: isLeftSidebarCollapsed
                          ? "none"
                          : "inline-block",
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
                        display: isLeftSidebarCollapsed
                          ? "none"
                          : "inline-block",
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
                    {allTitles.map((data, i) => {
                      return (
                        <div key={i} className="chat-category">
                          <div key={i} className="chat-subcategory">
                            <div
                              className="chatbot-item"
                              onClick={() => {
                                sendMessage("quit");
                                getOneMessage(data._id);
                                setObjectID(data._id);
                                sendMessage(data._id);
                              }}
                            >
                              <FiBookmark size={18} />
                              <span>{data.title.substring(0, 30)}</span>
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
          setLoading={setDataLoaded}
        />
      </>
    );
  } else {
    return <Loader />;
  }
};

export default DualSidebar;
