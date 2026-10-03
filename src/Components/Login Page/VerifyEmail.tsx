import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_V1 } from '../../utils/apiBase';
import '../Styles/login.css';

function VerifyEmail() {
  const location = useLocation();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token found.');
      return;
    }

    let cancelled = false;

    async function verify() {
      try {
        const res = await axios.get(
          `${API_V1}/auth/verify-email/${token}`
        );
        if (!cancelled) {
          setStatus('success');
          setMessage(res.data.result || 'Email verified successfully.');
        }
      } catch (err: any) {
        if (!cancelled) {
          setStatus('error');
          setMessage(
            err.response?.data?.result ||
              'Verification failed. The link may be invalid or expired.'
          );
        }
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [location.search]);

  return (
    <div className="container-grey auth-page">
      <div className="form-container verify-email-box">
        <div className="h1Box">
          <h1 className="h1">EMAIL VERIFICATION</h1>
          <div className="line"></div>
        </div>
        <p
          className={`p__opensans verify-email-message verify-email-message--${status}`}
        >
          {message}
        </p>
        {status !== 'loading' && (
          <div className="otherOption">
            <Link to="/login" className="otherbtns">
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
