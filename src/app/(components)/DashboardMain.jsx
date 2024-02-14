import React, { useEffect, useState } from "react";
import {
  Gantt,
  Task,
  EventOption,
  StylingOption,
  ViewMode,
  DisplayOption,
} from "gantt-task-react";
import dashboard from "../Assets/Home-svg/dashboard_black_icon.svg";
import { IoMdSearch } from "react-icons/io";
import "../Styles/DashboardMain.css";
import "gantt-task-react/dist/index.css";
import axios from "axios";
import Loader from "./Loader";

const DashboardMain = () => {
  const [searchText, setSearchText] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [filteredTask, setFiltredTask] = useState([]);
  const [allResources, setAllResources] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  // let tasks: Task[] = [{
  //   start: new Date(2020, 1, 1),
  //   end: new Date(2020, 1, 2),
  //   name: 'Idea',
  //   id: 'Task 0',
  //   type:'task',
  //   progress: 45,
  //   isDisabled: true,
  //   styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
  // }]
  const getManagerName = (data) => {
    return allResources.filter((fil) => fil._id === data)[0].name;
  };
  const gantProjectSelect = (data) => {
    console.log("selected Data ", data);
  };
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
  const filterSelect = (data) => {
    setFilter(data);
    setFiltredTask(
      data === "all" ? tasks : tasks.filter((fil) => fil.status === data)
    );
  };
  const formatDate = (inputDate) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  };
  useEffect(() => {
    console.log("dashboard", dashboard);
    axios
      .get("/api/projects")
      .then((resPro) => {
        setAllProjects(resPro.data.projects);
        const modifiedTasks = resPro.data.projects.map((task) => {
          const randomProgress = Math.floor(Math.random() * 100) + 1;
          const randomColor =
            "#" + Math.floor(Math.random() * 16777215).toString(16);

          return {
            ...task,
            start: new Date(task.start_date),
            end: new Date(task.end_date),
            name: task.name,
            id: task._id,
            type: "task",
            progress:
              task.status === "completed"
                ? 100
                : task.status === "inprogress"
                ? "45"
                : 0,
            isDisabled: true,
            styles: {
              progressColor: randomColor,
              progressSelectedColor: randomColor,
            },
          };
        });

        setTasks(modifiedTasks);
        setFiltredTask(modifiedTasks);
        console.log("Projects ", resPro.data.projects);
      })
      .then(() => {
        axios
          .get("/api/resources")
          .then((resRes) => {
            setAllResources(resRes.data.resources);
            console.log("Resources ", resRes.data.resources);
          })
          .then(() => {
            axios.get("/api/tasks").then((resTask) => {
              setAllTasks(resTask.data.tasks);
              console.log("tasks ", resTask.data.tasks);
              setDataLoaded(true);
            });
          });
      });
  }, []);
  if (dataLoaded) {
    return (
      <div className="dashboard_main">
        <div className="title">
          <img src={dashboard.src} alt="" />
          Dashboard
        </div>
        <div className="filter_container">
          <div className="filter_text">
            <IoMdSearch />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by Projects"
            />
          </div>
        </div>
        <div className="cards_container">
          <div class="info-card">
            <div class="title">
              <img alt="loggo" src={dashboard.src} class="project-img" />
              <div class="total-header">Total Projects</div>
            </div>
            <div class="project-number">{allProjects.length}</div>
          </div>
          <div class="info-card">
            <div class="title">
              <img alt="loggo" src={dashboard.src} class="project-img" />
              <div class="total-header">On Going Projects</div>
            </div>
            <div class="project-number">
              {allProjects.filter((res) => res?.status === "inprogress").length}
            </div>
          </div>
          <div class="info-card">
            <div class="title">
              <img alt="loggo" src={dashboard.src} class="project-img" />
              <div class="total-header">Completed Projects</div>
            </div>
            <div class="project-number">
              {allProjects.filter((res) => res?.status === "completed").length}
            </div>
          </div>
          <div class="info-card">
            <div class="title">
              <img alt="loggo" src={dashboard.src} class="project-img" />
              <div class="total-header">Critical Projects</div>
            </div>
            {/* <div class="project-number">{allProjects.filter((res)=> res?.status === 'critical').length}</div> */}
            <div class="project-number">1</div>
          </div>
        </div>
        <div className="chart_container">
          <div className="gantt_chart">
            <div className="chart_header">
              <div className="chart_title">
                <h3>Projects</h3>
              </div>
              <div className="filter_btns">
                <p
                  onClick={() => filterSelect("all")}
                  className={`fl_btn ${filter === "all" && "active"}`}
                >
                  All
                </p>
                <p
                  onClick={() => filterSelect("completed")}
                  className={`fl_btn ${filter === "completed" && "active"}`}
                >
                  Completed
                </p>
                <p
                  onClick={() => filterSelect("inprogress")}
                  className={`fl_btn ${filter === "inprogress" && "active"}`}
                >
                  On Going
                </p>
                <p
                  onClick={() => filterSelect("notstarted")}
                  className={`fl_btn ${filter === "notstarted" && "active"}`}
                >
                  Yet to Start
                </p>
              </div>
            </div>
            <Gantt
              tasks={filteredTask}
              onDoubleClick={gantProjectSelect}
              viewMode="Week" // Set the desired view mode (e.g., 'Day', 'Week', 'Month', 'Year')
              scrollable={false}
              listCellWidth={""}
              // onClick={onClick}
            />
          </div>
          <div className="upcoming_deliverable">
            <div className="upcoming_header">
              <div className="upcoming_title">Upcoming Deliverables</div>
              <div className="upcoming_showall">Show All</div>
            </div>
            <div className="upcoming_cards">
              {allProjects
                .filter((fil) => fil.status === "inprogress")
                .sort((a, b) => new Date(a.end_date) - new Date(b.end_date))
                .map((data,i) => {
                  return (
                    <div className="upcoming_card" key={i}>
                      <div className="upcoming_card_header1">
                        Delivery On:{data.end_date}
                      </div>
                      <div className="upcoming_card_header2">{data.name}</div>
                      <div className="upcoming_card_bottom">
                        <div className="upcoming_bottom_left">
                          <div className="profile_pic">
                            {getNameImg(getManagerName(data.managerId))}
                          </div>
                          <div className="upcoming_botton_name">
                            {getManagerName(data.managerId)}
                          </div>
                          <div></div>
                        </div>
                        <div className="upcoming_bottom_right">
                          <button>View</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="loader_container_main">
        <Loader />
      </div>
    );
  }
};

export default DashboardMain;
