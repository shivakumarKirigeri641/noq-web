import axios from "axios";
import { addlogin, removelogin } from "../store/slices/loginSlice";
import { SERVER } from "../utils/constants";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getgid } from "process";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div>
      <p>Welcome to NoQ</p>
      <img src={require("../images/logo.png")}></img>
      <button
        onClick={() => {
          navigate("/loginoptions");
        }}
      >
        start
      </button>
    </div>
  );
};

export default Home;
