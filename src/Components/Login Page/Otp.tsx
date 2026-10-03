import React , { useState} from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../Context/AuthProvider";
import '../Styles/login.css';


function OTP() {
    const [ otp , otpSet ] = useState<string>("");
    
    const { resetPasswordEmail , setOtpPassEmail } = useAuth();
    const navigate = useNavigate(); 

    const saveOTP = async () => {
        setOtpPassEmail(otp);
        navigate("/passwordReset");

    }
 return (
    
    
    <>{
        resetPasswordEmail != null ?
        <div className="container-grey auth-page">
        <div className="form-container">
            <div className='h1Box'>
                <h1 className='h1'>ENTER OTP</h1>
                <div className="line"></div>
            </div>
            <div className="loginBox">
                <div className="entryBox">
                    <div className="entryText">OTP</div>
                    <input className="email input" 
                    type="text" name="Email" placeholder="Your OTP" 
                    onChange={(e) => otpSet(e.target.value)} />
                </div>
                <button className="loginBtn  form-button"
                    onClick={saveOTP}>
                    Send OTP
                </button>

            </div>
        </div>
    </div>
    : <h2 className="container-grey">First go to your Forget Password</h2>
    }
    
    </>
    
)
}

export default OTP;