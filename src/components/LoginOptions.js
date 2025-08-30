import { useEffect } from "react";
import { motion } from "framer-motion";
import { SERVER } from "../utils/constants";
import { useNavigate } from "react-router";
import axios from "axios";

const LoginOptions = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const fetchlogin = async () => {
      const result = await axios.get(
        SERVER + "/noq/noqunreservedticket/login",
        { withCredentials: true }
      );
      console.log(result);
    };
    fetchlogin();
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/traindetails");
  };
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
      {/* Background logo */}
      <img
        src={require("../images/logo.png")}
        alt="Background Logo"
        className="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none"
      />

      {/* Welcome Card */}
      <motion.div
        //initial={{ opacity: 0, y: 30 }}
        //animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-sm p-4"
      >
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Welcome to NoQ</h2>
          <p className="text-gray-600 mb-6">No more in the queue</p>

          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              className="w-full rounded-2xl bg-blue-500 text-white py-2 px-4 hover:bg-blue-600 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginOptions;
