import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../Styles/login.css';

function SignupSuccess() {
  const location = useLocation();
  const email = location.state?.email || 'your email';

  return (
    <div className="container-grey auth-page">
      <div className="form-container verify-email-box">
        <div className="h1Box">
          <h1 className="h1">CHECK YOUR EMAIL</h1>
          <div className="line"></div>
        </div>
        <p className="p__opensans verify-email-message">
          We sent a verification link to <strong>{email}</strong>. Please click
          the link in that email to activate your account, then log in.
        </p>
        <div className="otherOption">
          <Link to="/login" className="otherbtns">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignupSuccess;
