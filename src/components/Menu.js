import { useNavigate } from "react-router-dom";
import { Slide } from "react-awesome-reveal";
import Layout from "./Layout";
import { Wallet, LogOut } from "lucide-react"; // icons
import Cookies from "js-cookie";
export default function Menu() {
  const navigate = useNavigate();

  const handleBookTickets = () => {
    const token = Cookies.get("token");
    if (!token) {
      alert("Session expired, please re-login!");
      navigate("/"); // redirect to login
      return;
    } else {
      navigate("/station-details"); // goes to StationDetails
    }
  };

  const handleHistory = () => {
    const token = Cookies.get("token");
    if (!token) {
      alert("Session expired, please re-login!");
      navigate("/"); // redirect to login
      return;
    } else {
      navigate("/ticket-history");
    }
  };

  const handleWallet = () => {
    const token = Cookies.get("token");
    if (!token) {
      alert("Session expired, please re-login!");
      navigate("/"); // redirect to login
      return;
    } else {
      //navigate("/wallet-recharge");
    }
  };

  const handleExit = async () => {
    const token = Cookies.get("token");
    if (!token) {
      alert("Session expired, please re-login!");
    } else {
      await axios.post(
        SERVER + "/unreserved-ticket/logout",
        {},
        {
          withCredentials: true,
        }
      );
    }
    navigate("/"); // redirect to login
  };

  return (
    <Layout>
      <div className="relative flex flex-col justify-center items-center h-screen w-screen">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1606122101045-78e0b57a6f57?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-orange-700/70" />

        {/* Top-right icons */}
        <div className="absolute top-4 right-4 flex space-x-4">
          <button
            onClick={handleWallet}
            className="p-2 bg-white/90 rounded-full shadow hover:bg-white transition"
            title="Wallet"
          >
            <Wallet className="w-5 h-5 text-orange-600" />
          </button>
          <button
            onClick={() => {
              handleExit();
            }}
            className="p-2 bg-white/90 rounded-full shadow hover:bg-white transition"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-red-600" />
          </button>
        </div>

        {/* Card */}
        <Slide triggerOnce>
          <div className="relative w-[360px] bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 flex flex-col space-y-4">
            <h1 className="text-xl font-bold text-center text-gray-800 mb-2">
              Welcome
            </h1>
            <p className="text-sm text-center text-gray-600 mb-4">
              Choose an option to continue
            </p>

            <button
              onClick={handleBookTickets}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
            >
              Book Unreserved Tickets
            </button>

            <button
              onClick={handleHistory}
              className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition"
            >
              Ticket History
            </button>

            <button
              onClick={handleWallet}
              className="w-full py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-medium transition"
            >
              Wallet Recharge
            </button>

            <button
              onClick={() => {
                handleExit();
              }}
              className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
            >
              Exit
            </button>
          </div>
        </Slide>

        {/* Footer */}
        <footer className="absolute bottom-3 text-center text-white text-xs">
          © {new Date().getFullYear()} ServePe App Solutions. All rights
          reserved.
        </footer>
      </div>
    </Layout>
  );
}
