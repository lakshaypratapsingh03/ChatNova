import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {

  const { axios } = useAppContext();
  const [email,setEmail] = useState("");
  const navigate=useNavigate();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

 const handleSubmit = async (e)=>{
    e.preventDefault();

     try {

      const {data} = await axios.post("/api/user/send-otp",{email});

      if(data.success){
        toast.success("OTP sent");
        setStep(2);
      }else{
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  // VERIFY OTP
  const verifyOtp = async (e)=>{
    e.preventDefault();

    try {

      const {data} = await axios.post("/api/user/verify-otp",{email,otp});

      if(data.success){
        toast.success("OTP verified");
        setStep(3);
      }else{
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  // RESET PASSWORD
  const resetPassword = async (e)=>{
    e.preventDefault();

    if(newPassword !== confirmPassword){
      return toast.error("Passwords do not match");
    }

    try {

      const {data} = await axios.post("/api/user/reset-password",{
        email,
        newPassword
      });

      if(data.success){
        toast.success("Password reset successful");
        navigate("/login");
      }else{
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
}
  

  return (
    <div className="flex w-full justify-center items-center h-screen">

      <form onSubmit={handleSubmit} className="bg-white/5 border border-purple-400 rounded-xl p-8">
        <div className="flex items-center gap-4 mb-4 ">
        <IoIosArrowRoundBack size={30} className='text-purple-400 text-center cursor-pointer'onClick={() => navigate("/login")}/>
        <h1 className="text-white text-2xl mb-4 text-center">Forgot Password</h1>
</div>
        {step == 1
        &&
        <div>
        <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        className="p-3 rounded w-full mb-4 text-white"/>

        <button className="bg-purple-700 px-6 py-2 rounded text-white w-full cursor-pointer">
          Send OTP
        </button>
        </div>}

          
           {step == 2
        &&
        <div>
        <input
        type="otp"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e)=>setOtp(e.target.value)}
        className="p-3 rounded w-full mb-4 text-white"/>

        <button onClick={verifyOtp} className="bg-purple-700 px-6 py-2 rounded text-white w-full cursor-pointer">
          Verify
        </button>
        </div>}



 {step == 3
        &&
        <div>
        <input
        type="password"
        placeholder="Enter New Password"
        value={newPassword}
        onChange={(e)=>setNewPassword(e.target.value)}
        className="p-3 rounded w-full mb-4 text-white"/>

    <input
        type="password"
        placeholder="Enter Confirm Password"
        value={confirmPassword}
        onChange={(e)=>setConfirmPassword(e.target.value)}
        className="p-3 rounded w-full mb-4 text-white"/>



        <button onClick={resetPassword} className="bg-purple-700 px-6 py-2 rounded text-white w-full cursor-pointer">
          Reset Passowrd
        </button>
        </div>}




      </form>

    </div>


    
  );
};

export default ForgotPassword;