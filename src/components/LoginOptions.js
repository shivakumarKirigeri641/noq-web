import { useNavigate } from "react-router";

const LoginOptions = () => {
  const navigate = useNavigate();
  return (
    <div>
      <p>Welcome to NoQ</p>
      <p>Select your option:</p>
      <button
        onClick={() => {
          navigate("/traindetails");
        }}
      >
        New unreserved ticket booking
      </button>
      <button>Download my unreserved ticket</button>
    </div>
  );
};

export default LoginOptions;
