import React, { useState } from "react";
import { addlogin } from "../store/slices/loginSlice";
import { SERVER } from "../utils/constants";
import { Form, Input, Button, Typography, Card } from "antd";
import { motion } from "framer-motion";
import "antd/dist/reset.css"; // modern antd reset
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

const { Title, Text } = Typography;

const LoginOptions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const hardcodedMobile = "9876543210"; // ✅ Hardcoded mobile
  const hardcodedOtp = "1234"; // ✅ Hardcoded OTP

  const handleSendOtp = (values) => {
    // ✅ send OTP API
    values.mobile = "9886122415";
    values.otp = "1234";
    console.log("Send OTP to:", values.mobile);
    setOtpSent(true);
  };

  const handleVerifyOtp = async (values) => {
    const result = await axios.post(
      SERVER + "/unreserved-ticket/verifyotp",
      {
        mobile_number: "9886122415",
        otp: "1234",
      },
      { withCredentials: true }
    );
    dispatch;
    console.log(result?.data);
    dispatch(addlogin(result?.data));
    navigate("/traindetails");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <motion.div
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-sm"
      >
        <Card
          className="rounded-2xl shadow-2xl"
          style={{ backgroundColor: "rgba(255,255,255,0.95)" }}
        >
          <Title level={3} className="text-center font-bold">
            Anti-queue Unreserved Ticketing
          </Title>
          <Text type="secondary" className="block text-center mb-6 italic">
            — because queue is clueless.
          </Text>

          {!otpSent ? (
            <Form layout="vertical" onFinish={handleSendOtp}>
              <Form.Item
                name="mobile"
                label="Mobile Number"
                rules={
                  [
                    /*{
                    required: true,
                    message: "Please enter your mobile number",
                  },
                  {
                    pattern: /^[6-9]\d{9}$/,
                    message: "Enter a valid 10-digit Indian mobile number",
                  },*/
                  ]
                }
              >
                <Input
                  maxLength={10}
                  placeholder="Enter 10-digit mobile"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  className="rounded-lg"
                >
                  Send OTP
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Form layout="vertical" onFinish={handleVerifyOtp}>
              <Form.Item
                name="otp"
                label="Enter OTP"
                rules={
                  [
                    /*{ required: true, message: "Please enter the OTP" },
                  {
                    len: 6,
                    message: "OTP must be 6 digits",
                  },*/
                  ]
                }
              >
                <Input maxLength={4} placeholder="4-digit OTP" size="large" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  className="rounded-lg bg-green-600 hover:bg-green-700"
                >
                  Verify OTP
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginOptions;
