import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_V1 } from '../../utils/apiBase';

export const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [resetPasswordEmail, setResetEmail] = useState(null);
  const [otpPassEmail, setOtpPassEmail] = useState(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn) {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Invalid user data in localStorage:', err);
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('user');
      }
    }
  }, []);

  async function signUp(name, password, email, confirm) {
    const res = await axios.post(
      `${API_V1}/auth/signup`,
      {
        name: name,
        password: password,
        confirmPassword: confirm,
        email,
      }
    );
    return res.data;
  }

  async function login(email, password) {
    const res = await axios.post(
      `${API_V1}/auth/login`,
      {
        email: email,
        password: password,
      }
    );
    setUser(res.data.user);
    Cookies.set('jwt', res.data.token, { expires: 7 });
    localStorage.setItem('loggedIn', true);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data;
  }

  function logout() {
    Cookies.remove('jwt');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('user');
    setUser(null);
  }

  const value = {
    user,
    login,
    signUp,
    logout,
    resetPasswordEmail,
    setResetEmail,
    otpPassEmail,
    setOtpPassEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;