import { useEffect } from "react";
import { motion } from "framer-motion";
import { SERVER } from "../utils/constants";
import { useNavigate } from "react-router";
import axios from "axios";
import { useSelector } from "react-redux";

const LoginOptions = () => {
  const navigate = useNavigate();
  const login = useSelector((store) => store.login);
  useEffect(() => {
    if (!login) {
      navigate("/");
    } else {
      const fetchlogin = async () => {
        const result = await axios.get(
          SERVER + "/noq/noqunreservedticket/login",
          { withCredentials: true }
        );
      };
      fetchlogin();
    }
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

          <div>
            <button
              type="submit"
              className="w-full rounded-2xl bg-blue-500 text-white py-2 px-4 hover:bg-blue-600 transition"
              onClick={handleSubmit}
            >
              Book Unreserved Ticket
            </button>
            <button
              type="submit"
              className="w-full rounded-2xl bg-blue-500 text-white py-2 px-4 hover:bg-blue-600 transition my-2"
              onClick={() => {
                navigate("/downloadticket");
              }}
            >
              Download unreserved ticket
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginOptions;
