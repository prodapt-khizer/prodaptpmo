// Assuming you're using 'websocket' library, make sure to install it with `npm install websocket` if you haven't already

"use client";
import Sidebar from "../../(components)/Sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { CiMicrophoneOn } from "react-icons/ci";
import Loader from "../../(components)/Loader";
import Home from "../../(components)/Home";
import DashboardMain from "../../(components)/DashboardMain";
import { VscSend } from "react-icons/vsc";

export default function Dashboard() {
  const router = useRouter();
  const [isChatActive, setIsChatActive] = useState(false);
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
  const [recognition, setRecognition] = useState(null);
  const [searchTextTemp, setSearchTextTemp] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [linecount, setLineCount] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [homeSearch, setHomeSearch] = useState(false);
  const [tempResponse, setTempResponse] = useState([]);
  const [tempQuestion, setTempQuestion] = useState([]);
  const [responseType, setResponseType] = useState("");
  const [currentQn, setCurrentQn] = useState(0);
  const [isQnAvailable, setIsQnAvailable] = useState(false);
  const [isQuestionCompleted, setIsQuestionCompleted] = useState(true);
  const calculateRows = () => {
    const textarea = document.getElementById("searchTextArea"); // use the actual id of your textarea
    const lineHeight = 30; // Adjust this value based on your textarea's line-height
    const rows = textarea && Math.floor(textarea.scrollHeight / lineHeight);

    setLineCount(Math.min(rows, 10));
  };
  useEffect(() => {
    calculateRows();
  }, [searchText]);
  useEffect(() => {
    getMessages();
    if (!window.localStorage.getItem("user")) {
      router.push("/login");
    }
  }, []);
  const handleSearch = () => {
    callOpenAi(searchText, searchText);
    setSearchTextTemp(searchText);
    setIsChatActive(true);
  };
  useEffect(() => {
    if (websocket) {
      // WebSocket connection already established
      return;
    }

    const uri = "ws://34.67.160.218:8655/";
    // const uri = "ws://localhost:8655";
    const ws = new W3CWebSocket(uri);

    ws.onopen = () => {
      console.log('Connected to server. Start chatting! Type "quit" to exit.');
      setWebsocket(ws);
    };

    ws.onmessage = (event) => {
      var data = JSON.parse(event.data);
      console.log(`Received: ${data.response},`);
      // if()
      setResponseType(data.response_type);

      // if (data.response_type === "question") {
      //   axios
      //     .post("/api/tasks", {
      //       _id: `task101`,
      //       ...data.details,
      //     })
      //     .then(() => {
      //       setAns(data);
      //     });
      // } else
       if (data.response_type === "question") {
        setIsQnAvailable(true);
        setIsQuestionCompleted(data.response_type !== "question");
        setTempResponse(
          data.response.map((temp) => ({ question: temp, answer: "" }))
        );
        console.log(data.response)
        setAns({ response_type: "message", response: data.response[0] });
      } else {
        setAns(data);
        setIsQuestionCompleted(data.response_type !== "question");
        setIsQnAvailable(false);
        setTempQuestion();
      }
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
  // useEffect(() => {
  //   console.log("Response data testing ", tempResponse);
  //   if (tempQuestion.length === currentQn) {
  //     sendMessage(JSON.stringify(tempResponse));
  //   }
  // }, [tempResponse, currentQn]);
  // useEffect(()=>{
  //   if(isQnAvailable && !isQuestionCompleted){
  //     if(tempQuestion.length > currentQn){
  //       setCurrentQn(currentQn+1);
  //     }
  //   }
  // },[qn])
  useEffect(() => {
    setIsQuestionCompleted(isQuestionCompleted.length === 0);
    setResponseType(isQuestionCompleted.length === 0 && "answer");
  }, [isQuestionCompleted]);
  const getOneMessage = (data) => {
    console.log("after error, ",data);
    axios
      .get("/api/messages/" + data, {
        timeout: 50000,
      })
      .then((res) => {
        setMessages(res.data.messages);
        setTitle(data);
        getMessages();
        setQn("");
        setAns("");
        setTitle(res.data.messages[0].title || qn);
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
  useEffect(() => {
    console.log(allTitles);
  }, [allTitles]);
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
  const handleSearchInitiation = () => {};

  const callOpenAi = (ti, data) => {
    console.log(ti, data);
    if (responseType === "Json-Questions") {
      setQn(ti);
      sendMessage(JSON.stringify(data));
    } else if (responseType === "question") {
      setGenerating(true);
      setQn(data);
      if (tempResponse.length === 1 || tempResponse.length - 2 === currentQn) {
        var tempData = tempResponse;
        tempData[currentQn].answer = data;
        sendMessage(JSON.stringify(tempData));
      } else {
        var tempData = tempResponse;
        tempData[currentQn].answer = data;
        setTempResponse(tempData);
        setAns({
          response_type: "message",
          response: tempData[currentQn + 1].question,
        });
        setCurrentQn(currentQn + 1);
      }
      // if (tempResponse) {
      //   setTempResponse((prev) => {
      //     const newResponse = [...prev]; // Create a copy of the previous array
      //     newResponse.push({
      //       question: tempQuestion[currentQn] || ans.response,
      //       answer: data,
      //     });
      //     return newResponse; // Return the updated array
      //   });
      // } else {
      //   setTempResponse([
      //     {
      //       question: tempQuestion[currentQn],
      //       answer: data,
      //     },
      //   ]);
      // }
    } else {
      if (objectID === "") {
        setObjectID("pmo" + new Date().toISOString().replace(/[-T:Z.]/g, ""));
        sendMessage("pmo" + new Date().toISOString().replace(/[-T:Z.]/g, ""));
        setGenerating(true);
        setQn(data);
        setTitleText(ti);
        sendMessage(data);
      } else {
        console.log("inside obj ", tempResponse, isQuestionCompleted);
        setGenerating(true);
        setQn(data);
        sendMessage((tempResponse && tempResponse.length != 0 && JSON.stringify(tempResponse)) || data);
      }
    }
  };
  useEffect(() => {
    if (objectID !== "") {
      getOneMessage(objectID);
    }
    if (qn != "" && ans != "") {
      console.log("coming here");
      axios
        .get("/api/messages/" + encodeURIComponent(objectID))
        .then((res) => {
          return res.data.messages[0];
        })
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
        })
        .catch(() => {
          console.log("error coming");
          axios
            .post("/api/messages", {
              _id: objectID,
              title: titleText,
              prompt: [qn],
              response: [ans],
              user: localStorage.getItem("user"),
              edited: false,
            })
            .then((res) => {
              getOneMessage(objectID);
              setGenerating(false);
            }).catch((e)=>{
              console.log("error creating ", e);
            })
        });
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
  useEffect(() => {
    // Initialize the recognition when the component mounts
    const recognitionInstance = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognitionInstance.lang = "en-US";
    setRecognition(recognitionInstance);

    recognitionInstance.onstart = () => {
      setIsRecording(true);
    };

    recognitionInstance.onend = () => {
      setIsRecording(false);
    };

    recognitionInstance.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      callOpenAi(voiceText, voiceText);
      setIsChatActive(true);
      setSearchTextTemp(voiceText);
    };
  }, []);
  const handleVoiceSearch = () => {
    recognition.start();
  };
  if (dataLoaded) {
    return (
      <main className="main_container">
        <Sidebar currentTab={"home"} setIsChatActive={setIsChatActive} />
        <div className={`separator-line`} />
        {isChatActive && (
          <Home
            onSearchInitiation={handleSearchInitiation}
            submitPrompt={callOpenAi}
            messages={messages}
            searching={generating}
            setLoading={setDataLoaded}
            chatClose={setIsChatActive}
            searchTextTemp={searchTextTemp}
            setSearchTextTemp={setSearchTextTemp}
            allTitles={allTitles}
            newChat={newChat}
            isChatActive={isChatActive}
            objectID={objectID}
            setObjectID={setObjectID}
            getOneMessage={getOneMessage}
            sendMessage={sendMessage}
            setIsChatActive={setIsChatActive}
            searchText={searchText}
            setSearchText={setSearchText}
            searchTitle={searchTitle}
            setSearchTitle={setSearchTitle}
          />
        )}

        {!isChatActive && (
          <>
            <div className="dashboard_container">
              <DashboardMain />
            </div>
            <div
              className="voice_container"
              style={{ width: homeSearch ? "90dvw" : "" }}
            >
              {/* <p className="openchat" onClick={() => setIsChatActive(true)}>
                Open Chat
              </p> */}
              <div className="icon_holder">
                <textarea
                  placeholder="Enter Message"
                  rows={1}
                  id="searchTextArea"
                  className="openchat"
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                  value={searchText}
                  onFocus={() => setHomeSearch(true)}
                  onBlur={() => setHomeSearch(searchText != "")}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  style={{
                    height: "10%",
                    fontSize: "16px",
                    width: "95%",
                    height: "100%",
                    overflowY: "auto",
                    display: homeSearch ? "block" : "none",
                  }}
                />
                <div
                  className="container-search-icon home_send_button"
                  style={{ display: homeSearch ? "block" : "none" }}
                  onClick={handleSearch}
                >
                  <VscSend size={18} />
                </div>
                <CiMicrophoneOn
                  onClick={handleVoiceSearch}
                  style={{ fontSize: "22px", color: "#fe2c30" }}
                />
              </div>
            </div>
          </>
        )}
      </main>
    );
  } else {
    return <Loader />;
  }
}
