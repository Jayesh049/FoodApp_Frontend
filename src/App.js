import React from 'react';
import Signup from './Components/Login Page/Signup';
import Home from './Components/Home Page/Home';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from './Components/Home Page/NavBar';
import Footer from './Components/Home Page/Footer';
import Login from './Components/Login Page/Login';
import ForgetPassword from './Components/Login Page/ForgetPassword';
import AllPlans from './Components/Plan Page/AllPlans';
import AuthProvider, { useAuth } from './Components/Context/AuthProvider';
import Profile from './Components/Profile Page/Profile';
import PlanDetail from './Components/PlanDetail Page/PlanDetail';
import Otp from './Components/Login Page/Otp';
import PasswordReset from './Components/Login Page/PasswordReset';


import Booking1 from './Components/Home Page/Booking1';
import PaymentSuccess from './Components/Home Page/PaymentSuccess';
function App() {
  // const user = useAuth();
  const isLoggedIn = window.localStorage.getItem("loggedIn");

  return (
    <Router>
      {/* is providing the data that is your user logged in or not */}
      <AuthProvider>
        <NavBar />
        <Switch>
        <Route path="/paymentsuccess">
            <PaymentSuccess />
          </Route>

          <Route path="/booking1">
            <Booking1 />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/profilePage">
            <Profile />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/forgetPassword">
            <ForgetPassword />
          </Route>
          <Route path = "/otp">
            <Otp />
          </Route>
          <Route path ="/passwordReset">
            <PasswordReset></PasswordReset>
          </Route>
          <Route path="/allPlans">
            <AllPlans />
          </Route>
          <Route path="/planDetail/:id">  
            <PlanDetail />
          </Route>
          <Route path="/" >
              {isLoggedIn === "true" ? <Home />  :  <Home/>}  
          </Route>

        <Footer />
        </Switch>
      </AuthProvider>
    </Router>
  );
}
export default App;
