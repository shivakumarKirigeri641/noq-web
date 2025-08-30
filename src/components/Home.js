import React from "react";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    /*const calllogout = async () => {
      const result = await axios.get(
        SERVER + "/noq/noqunreservedticket/logout",
        { withCredentials: true }
      );
    };
    calllogout();*/
  }, []);
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
