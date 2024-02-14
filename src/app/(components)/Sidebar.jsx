// DualSidebar.js
"use client";
import React, { useEffect, useState } from "react";
import { BsChevronBarDown, BsChevronCompactDown, BsChevronDown, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { RiHome6Fill, RiSettings3Line } from "react-icons/ri";
import { LuCompass } from "react-icons/lu";
import "../Styles/Sidebar.css";
import "../Styles/Home.css";
import chatData from "../../Data/chatData.json";
import Logo from "./Logo";
import homeFill from "../Assets/Home-svg/dashboard_icon.svg";
import home from "../Assets/Home-svg/dashboard_black_icon.svg";
import projectFill from "../Assets/Home-svg/Project_icon.svg";
import project from "../Assets/Home-svg/project_black_icon.svg";
import settingFill from "../Assets/Home-svg/Settings_icon.svg";
import setting from "../Assets/Home-svg/Settings_icon.svg";
import { RxDividerHorizontal } from "react-icons/rx";
import { FaPlus } from "react-icons/fa";



import HomeSearch from "./HomeSearch";
import Loader from "@/app/(components)/Loader";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

const Sidebar = (props) => {
  const [isLeftSidebarCollapsed, setLeftSidebarCollapsed] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState(
    jwt.decode(localStorage.getItem("user-token"))
  );
  const [isHomeActive, setHomeActive] = useState(props.currentTab === 'home');
  const [isProjectActive, setProjectActive] = useState(props.currentTab === 'projects');
  const [isSettingsActive, setSettingsActive] = useState(props.currentTab === 'settings');
  const [isNewActive, setIsNewActive] = useState(props.currentTab === 'new');

  const getNameImg = (name) => {
    // Split the name into an array of words
    const words = name.split(" ");
    // Capitalize the first letter of the first word
    const firstName = words[0].charAt(0).toUpperCase();

    // Capitalize the first letter of the last word
    const lastName = words[words.length - 1].charAt(0).toUpperCase();

    console.log("Name ", name, words, firstName, lastName);
    // Combine the capitalized first name and last name
    const result = `${firstName} ${lastName}`;

    return result;
  };

  const toggleLeftSidebar = () => {
    setLeftSidebarCollapsed(!isLeftSidebarCollapsed);
  };

  const handleItemClick = (itemName) => {
    setHomeActive(itemName === "home");
    setProjectActive(itemName === "project");
    setSettingsActive(itemName === "settings");
    setIsNewActive(itemName === "new")
  };
  const goToHome = () => {
    router.push("/");
  };

  const goToProject = () => {
    router.push("/projects");
  };

  return (
    <div className={`sidebar ${isLeftSidebarCollapsed ? "collapsed" : ""}`}>
      <Logo isCollapsed={isLeftSidebarCollapsed} />
      <div className="content">
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
                <img src={isHomeActive ? homeFill.src : home.src} alt="" />
              </div>
              <span
                style={{
                  display: isLeftSidebarCollapsed ? "none" : "inline-block",
                  fontSize: "14px",
                }}
              >
                Home
              </span>
            </div>
          </div>

          {/* Compass */}
          <div
            className={`sidebar-item ${isProjectActive ? "active" : ""}`}
            onClick={() => {
              handleItemClick("project");
              goToProject();
            }}
          >
            <div className="sidebar-item-content">
              <div className="sidebar-item-box">
              <img src={isProjectActive ? projectFill.src : project.src} alt="" />
              </div>
              <span
                style={{
                  display: isLeftSidebarCollapsed ? "none" : "inline-block",
                  fontSize: "12px",
                }}
              >
                Projects
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
                <img src={isSettingsActive ? settingFill.src : setting.src} alt="" />
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
          <RxDividerHorizontal className="divider" style={{
            width: isLeftSidebarCollapsed ? '50px' : '200px',
            height: '2px',
            background: '#fff'
          }} />
          <div
            className={`sidebar-item ${isNewActive ? "active" : ""}`}
            onClick={() => {
              handleItemClick("new");
              props.setIsChatActive(true)
            }}
          >
            <div className="sidebar-item-content">
              <div className="sidebar-item-box">
              <FaPlus size={25} />
              </div>
              <span
                style={{
                  display: isLeftSidebarCollapsed ? "none" : "inline-block",
                  fontSize: "12px",
                }}
              >
                New Project
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="sidebar_bottom">
        <div className="user">
          {user?.profile ? (
            <img src={user.profile} alt="user" />
          ) : (
            <div className="profile_pic">{getNameImg(user.name)}</div>
          )}
          {!isLeftSidebarCollapsed && (
            <div className="user_name">{user.name} <span className="logout_container" style={{margin: '0 5px', cursor: 'pointer', position: 'relative'}}><BsChevronDown size={16} /> <div className="logout" >Sign Out</div></span></div>
          )}
        </div>
          <div className="toggle-btn-container" onClick={toggleLeftSidebar}>
            {isLeftSidebarCollapsed ? <BsChevronRight /> : <BsChevronLeft />}
          </div>
        
      </div>
    </div>
  );
};

export default Sidebar;
