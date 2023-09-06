import React, { useState } from 'react';
import '../Styles/login.css'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../Context/AuthProvider';

function ForgetPassword() {
    const [email, emailSet] = useState("");
    const { setResetEmail } = useAuth();
    const history = useHistory();
        
    const sendEmail = async() => {
        try {
            let res = await axios.patch("https://foodappbackend-lk5m.onrender.com/api/v1/auth/forgetPassword", { email })
            if(res.status === 404){
                alert("user with this email not found");
            }else if(res.status === 500){
                alert("Internal server error");
            }else{
                alert("Mail send to your registered email ID");
                setResetEmail(email);
                
                history.push("/otp");
            }
        } catch (err){
            console.log(err.message);
        }
        
    }
    return (
        <div className="container-grey">
            <div className="form-container">
                <div className='h1Box'>
                    <h1 className='h1'>FORGET PASSWORD</h1>
                    <div className="line"></div>
                </div>
                <div className="loginBox">
                    <div className="entryBox">
                        <div className="entryText">Email</div>
                        <input className="email input" 
                        type="email" name="Email" placeholder="Your Email" //required="" ye humein kuch bhi enter karne se rok raha tha
                        onChange={(e) => emailSet(e.target.value)} />
                    </div>
                    <button className="loginBtn  form-button"
                        onClick={sendEmail}
                        // type="submit" humein submit button type nahi chahiye
                    >
                        Send Email
                    </button>

                </div>
            </div>
        </div>
    )
}

export default ForgetPassword
