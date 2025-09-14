import React, { useState } from "react";
import LoginStep from "./LoginStep";
import OtpStep from "./OtpStep";
import LoggedInStep from "./LoggedInStep";
import MenuStep from "./MenuStep";
import TrainDetails from "./TrainDetails";

const LoginOptions = () => {
  const [step, setStep] = useState(1); // 1=login, 2=otp, 3=loggedin, 4=menu, 5=train details
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const handleLogout = () => {
    setStep(1);
    setMobile("");
    setOtp("");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900">
      <div className="relative w-full max-w-[420px] h-screen flex flex-col text-white">
        <div className="flex-1 flex flex-col justify-center px-6">
          <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-xl p-6 animate-[fadeIn_0.8s_ease-out]">
            {step === 1 && (
              <LoginStep
                mobile={mobile}
                setMobile={setMobile}
                onNext={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <OtpStep
                otp={otp}
                setOtp={setOtp}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === -1 && (
              <LoggedInStep
                onNext={() => setStep(4)}
                onBack={() => setStep(2)}
              />
            )}
            {step === 3 && (
              <MenuStep
                onSelect={(value) =>
                  value === "book" ? setStep(4) : alert(value + " placeholder")
                }
                onExit={handleLogout}
              />
            )}
            {step === 4 && <TrainDetails goBack={() => setStep(4)} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginOptions;
