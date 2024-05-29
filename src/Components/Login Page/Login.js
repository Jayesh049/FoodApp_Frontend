

import { Link } from "react-router-dom";
import '../Styles/login.css'
import React, { useState, useContext } from 'react';
import { AuthContext } from '../Context/AuthProvider';
import { useHistory } from 'react-router-dom';

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await login(email, password);
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="container-grey">
      <div className="form-container">
        <div className='h1Box'>
          <h1 className='h1'>LOGIN</h1>
          <div className="line"></div>
        </div>

        <div className="loginBox">
          <div className="entryBox">
            <div className="entryText">Email</div>
            <input className="email input" type="email" name="Email" placeholder="Your Email" required="" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="entryBox">
            <div className="entryText">Password</div>
            <input className="password input" type="password" name="Password" placeholder="**********" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="loginBtn  form-button" onClick={handleLogin}>
            Login
          </button>
          <div className='otherOption'>
            <button className=" otherbtns form-button" type="submit" >
              <Link to="/signup" className="otherbtns">Sign Up</Link>
            </button>
            <button className=" otherbtns form-button" type="submit">
              <Link to="/forgetPassword" className="otherbtns">Forget Password</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;