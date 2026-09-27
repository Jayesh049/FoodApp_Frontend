
import { Link, useLocation } from 'react-router-dom';
import '../Styles/login.css';
import React, { useState, useContext } from 'react';
import { AuthContext } from '../Context/AuthProvider';
import { useHistory } from 'react-router-dom';
import { isAdmin } from '../../utils/isAdmin';

function Login() {
  const history = useHistory();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [adminLoginSuccess, setAdminLoginSuccess] = useState(false);
  const { login } = useContext(AuthContext);

  const nextPath =
    new URLSearchParams(location.search).get('next') || '/';

  const isAdminLoginPage = nextPath === '/admin/rag';

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setNeedsVerification(false);
    setAdminLoginSuccess(false);
    setSubmitting(true);
    try {
      const data = await login(email, password);
      if (isAdmin(data.user)) {
        setAdminLoginSuccess(true);
        return;
      }
      history.push(nextPath === '/admin/rag' ? '/' : nextPath);
    } catch (err) {
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
            onClick={() => history.push('/admin/rag')}
          >
            Open Admin AI Dashboard
          </button>
          <button
            type="button"
            className="otherbtns form-button admin-home-btn"
            onClick={() => history.push('/')}
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