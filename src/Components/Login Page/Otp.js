import React , { useState} from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";


function OTP() {
    const [ otp , otpSet ] = useState("");
    
    const { resetPasswordEmail , setOtpPassEmail } = useAuth();
    const history = useHistory(); 

    const saveOTP = async () => {
        setOtpPassEmail(otp);
        history.push("/passwordReset");

    }
 return (
    
    
    <>{
        resetPasswordEmail != null ?
        <div className="container-grey">
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