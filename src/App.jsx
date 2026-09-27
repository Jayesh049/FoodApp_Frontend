import React from 'react';
import Signup from './Components/Login Page/Signup';
import Home from './Components/Home Page/Home';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Login from './Components/Login Page/Login';
import ForgetPassword from './Components/Login Page/ForgetPassword';
import AllPlans from './Components/Plan Page/AllPlans';
import AuthProvider from './Components/Context/AuthProvider';
import Profile from './Components/Profile Page/Profile';
import PlanDetailsPage from './Components/Plan Page/PlanDetailsPage';
import Otp from './Components/Login Page/Otp';
import PasswordReset from './Components/Login Page/PasswordReset';
import VerifyEmail from './Components/Login Page/VerifyEmail';
import SignupSuccess from './Components/Login Page/SignupSuccess';
import ErrorBoundary from './Components/ErrorBoundary';
import LayoutWrapper from './Components/LayoutWrapper';
import { CartProvider } from './Components/Cart/CartProvider';

import Booking1 from './Components/Home Page/Booking1';
import PaymentSuccess from './Components/Home Page/PaymentSuccess';
import ReviewPage from './Components/Review Page/ReviewPage';
import AdminRag from './Components/Admin/AdminRag';
import AdminSections from './Components/Admin/AdminSections';
import AdminPlans from './Components/Admin/AdminPlans';
import RequireAuth from './Components/Auth/RequireAuth';
import RequireAdmin from './Components/Auth/RequireAdmin';
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <CartProvider>
            <Switch>
            <Route path="/paymentsuccess">
              <LayoutWrapper showHeader={true} showFooter={true}>
                <PaymentSuccess />
              </LayoutWrapper>
            </Route>
            <Route path="/booking1">
              <LayoutWrapper showHeader={false} showFooter={false}>
                <RequireAuth>
                  <Booking1 />
                </RequireAuth>
              </LayoutWrapper>
            </Route>
            <Route path="/signup">
              <LayoutWrapper showHeader={true} showFooter={false}>
                <Signup />
              </LayoutWrapper>
            </Route>
            <Route path="/signup-success">
              <LayoutWrapper showHeader={true} showFooter={false}>
                <SignupSuccess />
              </LayoutWrapper>
            </Route>
            <Route path="/verify-email">
              <LayoutWrapper showHeader={true} showFooter={false}>
                <VerifyEmail />
              </LayoutWrapper>
            </Route>
            <Route path="/profilePage">
              <LayoutWrapper showHeader={true} showFooter={true}>
                <Profile />
              </LayoutWrapper>
            </Route>
            <Route path="/login">
              <LayoutWrapper showHeader={true} showFooter={false}>
                <Login />
              </LayoutWrapper>
            </Route>
            <Route path="/forgetPassword">
              <LayoutWrapper showHeader={true} showFooter={false}>
                <ForgetPassword />
              </LayoutWrapper>
            </Route>
            <Route path="/otp">
              <LayoutWrapper showHeader={true} showFooter={false}>
                <Otp />
              </LayoutWrapper>
            </Route>
            <Route path="/passwordReset">
              <LayoutWrapper showHeader={true} showFooter={false}>
                <PasswordReset />
              </LayoutWrapper>
            </Route>
            <Route path="/allPlans">
              <LayoutWrapper showHeader={true} showFooter={true}>
                <AllPlans />
              </LayoutWrapper>
            </Route>
            <Route
              path="/planDetail/:id"
              render={({ match }) => (
                <Redirect to={`/planDetails/${match.params.id}`} />
              )}
            />
            <Route path="/planDetails/:id">  
              <LayoutWrapper showHeader={true} showFooter={true}>
                <PlanDetailsPage />
              </LayoutWrapper>
            </Route>
            <Route path="/review">
              <LayoutWrapper showHeader={true} showFooter={true}>
                <ReviewPage />
              </LayoutWrapper>
            </Route>
            <Route path="/admin/sections">
              <LayoutWrapper showHeader={true} showFooter={false}>
                <RequireAdmin>
                  <AdminSections />
                </RequireAdmin>
              </LayoutWrapper>
            </Route>
            <Route path="/admin/rag">
              <LayoutWrapper showHeader={true} showFooter={false}>
                <RequireAdmin>
                  <AdminRag />
                </RequireAdmin>
              </LayoutWrapper>
            </Route>
            <Route path="/admin/plans">
              <LayoutWrapper showHeader={true} showFooter={false}>
                <RequireAdmin>
                  <AdminPlans />
                </RequireAdmin>
              </LayoutWrapper>
            </Route>
            <Route path="/">
              <LayoutWrapper showHeader={true} showFooter={true}>
                <Home />
              </LayoutWrapper>
            </Route>
            </Switch>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}
export default App;
