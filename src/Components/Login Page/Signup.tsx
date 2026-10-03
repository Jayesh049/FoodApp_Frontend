import React, { useState } from 'react';
import '../Styles/login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthProvider';

function Signup(props) {
    const navigate = useNavigate();
    const { signUp } = useAuth()
    const [name, nameSet] = useState<string>("");
    const [password, passwordSet] = useState<string>("");
    const [email, emailSet] = useState<string>("");
    const [confirm, setConfirm] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }
        setSubmitting(true);
        try {
            const data = (await signUp(name, password, email, confirm)) as { email?: string };
            navigate("/signup-success", { state: { email: data.email || email } });
        }
        catch (err: any) {
            setError(err.response?.data?.result || "Signup failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }
    return (
        <div className="container-grey auth-page">
            <div className="form-container">
                <div className='h1Box'>
                    <h1 className='h1'>SIGN UP</h1>
                    <div className="line"></div>
                </div>
                <div className="loginBox">
                    <div className="entryBox">
                        <div className="entryText">Name</div>
                        <input className="name input" type="text" name="Name" placeholder="Your Name" required onChange={(e) => nameSet(e.target.value)} />
                    </div>
                    <div className="entryBox">
                        <div className="entryText">Email</div>
                        <input className="email input" type="email" name="Email" placeholder="Your Email" required onChange={(e) => emailSet(e.target.value)} />
                    </div>
                    <div className="entryBox">
                        <div className="entryText">Password</div>
                        <input className="password input" type="password" name="Password" placeholder="**********" onChange={(e) => passwordSet(e.target.value)} />
                    </div>
                    <div className="entryBox">
                        <div className="entryText">Confirm  Password</div>
                        <input className="confirmPassword input" type="password" name="ConfirmPassword" placeholder="**********" onChange={(e) => setConfirm(e.target.value)} />
                    </div>
                    {error && <p className="auth-error-msg">{error}</p>}
                    <button className="loginBtn form-button" type="submit" onClick={handleSignup} disabled={submitting}>
                        {submitting ? 'Signing up...' : 'Sign Up'}
                    </button>

                </div>
            </div>
        </div>
    )
}

export default Signup;
