import React, { useEffect, useState } from "react";
import "../Styles/Login.css";
import axios from "axios";
import jwt from 'jsonwebtoken';
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const [token, setToken] = useState();
  const router = useRouter();
  
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  useEffect(()=>{
    if(window.localStorage.getItem("user")){
      router.push('/');
    }
  },[token])
  const handleLogin = () =>{
    axios.post('/api/users',{
      email: userName,
      password: password
    }).then((res)=>{
      setToken(res.data.token);
      localStorage.setItem("user-token", res.data.token);
      localStorage.setItem("user",jwt.decode(res.data.token).userID)
    })
  }
  const handleSignup = () =>{
    axios.put('/api/users',{
      name: name,
      email: email,
      password: pwd,
      password_confirmation: pwd
    }).then((res)=>{
      setToken(res.data.token);
      localStorage.setItem("user-token", res.data.token);
      localStorage.setItem("user",jwt.decode(res.data.token).userID)
    })
  }
  return (
    <section className="login_container forms">
      <div className={`form ${activeTab}`}>
        <div className="form-content">
          <header>{activeTab === "login" ? "Login" : "Sign Up"}</header>
          {activeTab === "login" ? (
            <form action="#">
              <div className="field input-field">
                <input
                  type="email"
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Email"
                  className="input"
                />
              </div>
              <div className="field input-field">
                <input
                  type="password"
                  placeholder="Password"
                  className="password"
                  onChange={(e)=> setPassword(e.target.value)}
                />
                <i className="bx bx-hide eye-icon"></i>
              </div>
              <div className="form-link">
                <a href="#" className="forgot-pass">
                  Forgot password?
                </a>
              </div>
              <div className="field button-field">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogin();
                  }}
                >
                  Login
                </button>
              </div>
            </form>
          ) : (
            <form action="#">
              <div className="field input-field">
                <input type="text" placeholder="Name" className="input" onChange={(e)=> setName(e.target.value)} />
              </div>
              <div className="field input-field">
                <input type="email" placeholder="Email" className="input" onChange={(e)=> setEmail(e.target.value)} />
              </div>
              <div className="field input-field">
                <input
                  type="password"
                  placeholder="Create password"
                  className="password"
                  onChange={(e)=> setPwd(e.target.value)}
                />
              </div>
              <div className="field input-field">
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="password"
                />
                <i className="bx bx-hide eye-icon"></i>
              </div>
              <div className="field button-field">
                <button onClick={(e)=>{
                  e.preventDefault();
                  handleSignup();
                }}>Signup</button>
              </div>
            </form>
          )}
          <div className="form-link">
            <span>
              {`Don't have an account? `}
              <span
                className="link signup-link"
                onClick={() =>
                  setActiveTab(activeTab === "login" ? "signup" : "login")
                }
              >
                {activeTab === "login" ? "Signup" : "Login"}
              </span>
            </span>
          </div>
        </div>
        <div className="line"></div>
        <div className="media-options">
          <button className="ms_btn">
            <object
              type="image/svg+xml"
              data="https://s3-eu-west-1.amazonaws.com/cdn-testing.web.bas.ac.uk/scratch/bas-style-kit/ms-pictogram/ms-pictogram.svg"
              className="x-icon"
            ></object>
            Sign in with Microsoft
          </button>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
