import axios from 'axios';
import '../Styles/login.css'
import React , { useState }  from 'react';
import { useAuth } from '../Context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { API_V1 } from '../../utils/apiBase';

function PasswordReset() {

    const [ password , passwordSet ] = useState<string>("");
    const [passwordcnf , passwordcnfset ] = useState<string>("");

    const {resetPasswordEmail , setResetEmail , setOtpPassEmail , otpPassEmail } = useAuth();
    const navigate = useNavigate();

    const resetPassword = async () =>{
        
        try {
            let res = await axios.patch(`${API_V1}/auth/resetPassword`,{
                otp : otpPassEmail,
                email: resetPasswordEmail,
                password : password,
                confirmPassword : passwordcnf
            })
            if(res.status === 201){
                alert("password changed successfully");
                setOtpPassEmail(null);
                setResetEmail(null);
                navigate("/login");
            } else if (res.status === 400) {
                const msg = String((res.data && (res.data.result || res.data.message)) || "");
                if (/otp expired/i.test(msg)) {
                    alert("Otp expired kindly regenerate");
                } else if (/wrong otp/i.test(msg)) {
                    alert("wrong otp");
                }
                setOtpPassEmail(null);
                setResetEmail(null);
            }
        } catch (err: any){
            console.log(err.message);
            if(err.message === "Request failed with status code 500"){
                alert("Internal server error");
            }
            setOtpPassEmail(null);
            setResetEmail(null);
        }
    }
    return (
        //agar email aur otp mili hai toh hi iss page se redirect karo 
        //nahi mile hai toh first go to your forget password
        <>
        {
            resetPasswordEmail && otpPassEmail ?
            <div className="container-grey auth-page">
        <div className="form-container">
            <div className='h1Box'>
                <h1 className='h1'>ENTER OTP</h1>
                <div className="line"></div>
            </div>
            <div className="loginBox">
            <div className="entryBox">
                        <div className="entryText">Password</div>
                        <input className="password input" type="text" value={password}  onChange={(e) => passwordSet(e.target.value)} />
                    </div>
                    <div className="entryBox">
                        <div className="entryText">Confirm  Password</div>
                        <input className="password input" type="text" value={passwordcnf}  onChange={(e) => passwordcnfset(e.target.value)} />
                    </div>
                <button className="loginBtn  form-button"
                    onClick={resetPassword}>
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
export default PasswordReset