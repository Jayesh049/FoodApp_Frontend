import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetPasswordEmail, setResetEmail] = useState(null);
  const [otpPassEmail, setOtpPassEmail] = useState(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn) {
      setUser(JSON.parse(localStorage.getItem('user')));
    }
  }, []);

  async function signUp(name, password, email, confirm) {
    try {
      const res = await axios.post(
        'https://foodappbackend-lk5m.onrender.com/api/v1/auth/signup',
        {
          name: name,
          password: password,
          confirmPassword: confirm,
          email,
        }
      );
      setUser(res.data.user);
      Cookies.set('jwt', res.data.token, { expires: 7 });
      localStorage.setItem('loggedIn', true);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (err) {
      console.log(err);
    }
  }

  async function login(email, password) {
    try {
      const res = await axios.post(
        'https://foodappbackend-lk5m.onrender.com/api/v1/auth/login',
        {
          email: email,
          password: password,
        }
      );
      setUser(res.data.user);
      Cookies.set('jwt', res.data.token, { expires: 7 });
      localStorage.setItem('loggedIn', true);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (err) {
      console.log(err);
    }
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
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;