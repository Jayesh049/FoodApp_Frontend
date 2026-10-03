
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../Styles/login.css';
import React, { useState } from 'react';
import { useAuth } from '../Context/AuthProvider';
import { isAdmin } from '../../utils/isAdmin';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [needsVerification, setNeedsVerification] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [adminLoginSuccess, setAdminLoginSuccess] = useState<boolean>(false);
  const { login, demoLogin } = useAuth();

  const nextPath =
    new URLSearchParams(location.search).get('next') || '/';

  const isAdminLoginPage = nextPath === '/admin/rag';

  async function handleDemo(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = (await demoLogin()) as { user?: { role?: string } };
      if (isAdmin(data.user)) {
        setAdminLoginSuccess(true);
        return;
      }
      navigate(nextPath === '/admin/rag' ? '/' : nextPath);
    } catch (err: any) {
      setError(err.response?.data?.result || 'Demo login is not available.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setNeedsVerification(false);
    setAdminLoginSuccess(false);
    setSubmitting(true);
    try {
      const data = (await login(email, password)) as { user?: { role?: string } };
      if (isAdmin(data.user)) {
        setAdminLoginSuccess(true);
        return;
      }
      navigate(nextPath === '/admin/rag' ? '/' : nextPath);
    } catch (err: any) {
      const msg =
        err.response?.data?.result ||
        "Login failed. Please check your email and password.";
      setError(msg);
      if (err.response?.data?.needsVerification) {
        setNeedsVerification(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (adminLoginSuccess) {
    return (
      <div className="container-grey auth-page">
        <div className="form-container admin-login-success">
          <div className="h1Box">
            <h1 className="h1">ADMIN</h1>
            <div className="line" />
          </div>
          <p className="p__opensans admin-login-success__text">
            You are signed in as an administrator. Open the AI dashboard to check Ollama,
            vector index, and run reindex.
          </p>
          <button
            type="button"
            className="loginBtn form-button admin-dashboard-btn"
            onClick={() => navigate('/admin/rag')}
          >
            Open Admin AI Dashboard
          </button>
          <button
            type="button"
            className="otherbtns form-button admin-home-btn"
            onClick={() => navigate('/')}
          >
            Continue to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-grey auth-page">
      <div className="form-container">
        <div className='h1Box'>
          <h1 className='h1'>LOGIN</h1>
          <div className="line"></div>
        </div>

        {isAdminLoginPage && (
          <p className="p__opensans admin-login-hint">
            Admin sign-in: use the admin account from your Backend <code>.env</code>
            (<code>ADMIN_EMAIL</code> / <code>ADMIN_PASSWORD</code>). After login, open{' '}
            <strong>Admin AI</strong> in the navbar.
          </p>
        )}

        <div className="loginBox">
          <div className="entryBox">
            <div className="entryText">Email</div>
            <input
              className="email input"
              type="email"
              name="Email"
              placeholder="Your Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="entryBox">
            <div className="entryText">Password</div>
            <input
              className="password input"
              type="password"
              name="Password"
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="auth-error-msg">{error}</p>}
          {needsVerification && (
            <p className="auth-verify-hint p__opensans">
              Didn&apos;t get the email? Check Spam, or{' '}
              <Link to="/signup">sign up again</Link> with the same address.
            </p>
          )}
          <button className="loginBtn form-button" onClick={handleLogin} disabled={submitting}>
            {submitting ? 'Logging in...' : 'Login'}
          </button>
          <button type="button" className="otherbtns form-button" onClick={handleDemo} disabled={submitting}>
            Demo login
          </button>
          <div className='otherOption'>
            <Link to="/signup" className="otherbtns form-button">
              Sign Up
            </Link>
            <Link to="/forgetPassword" className="otherbtns form-button">
              Forget Password
            </Link>
          </div>
          <div className="admin-login-entry">
            <Link to="/login?next=/admin/rag" className="admin-login-entry__link">
              Admin access →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;