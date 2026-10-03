import React, { Suspense } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import AuthProvider from "./Components/Context/AuthProvider";
import ErrorBoundary from "./Components/ErrorBoundary";
import LayoutWrapper from "./Components/LayoutWrapper";
import { CartProvider } from "./Components/Cart/CartProvider";
import RequireAuth from "./Components/Auth/RequireAuth";
import RequireAdmin from "./Components/Auth/RequireAdmin";

const Signup = React.lazy(() => import("./Components/Login Page/Signup"));
const Home = React.lazy(() => import("./Components/Home Page/Home"));
const Login = React.lazy(() => import("./Components/Login Page/Login"));
const ForgetPassword = React.lazy(() => import("./Components/Login Page/ForgetPassword"));
const AllPlans = React.lazy(() => import("./Components/Plan Page/AllPlans"));
const Profile = React.lazy(() => import("./Components/Profile Page/Profile"));
const PlanDetailsPage = React.lazy(() => import("./Components/Plan Page/PlanDetailsPage"));
const Otp = React.lazy(() => import("./Components/Login Page/Otp"));
const PasswordReset = React.lazy(() => import("./Components/Login Page/PasswordReset"));
const VerifyEmail = React.lazy(() => import("./Components/Login Page/VerifyEmail"));
const SignupSuccess = React.lazy(() => import("./Components/Login Page/SignupSuccess"));
const Booking1 = React.lazy(() => import("./Components/Home Page/Booking1"));
const PaymentSuccess = React.lazy(() => import("./Components/Home Page/PaymentSuccess"));
const ReviewPage = React.lazy(() => import("./Components/Review Page/ReviewPage"));
const AdminRag = React.lazy(() => import("./Components/Admin/AdminRag"));
const AdminSections = React.lazy(() => import("./Components/Admin/AdminSections"));
const AdminPlans = React.lazy(() => import("./Components/Admin/AdminPlans"));

function Page({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="route-fallback" role="status">Loading</div>}>
      {children}
    </Suspense>
  );
}

function PlanDetailRedirect() {
  const { id } = useParams();
  return <Navigate to={`/planDetails/${id}`} replace />;
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route
                path="/paymentsuccess"
                element={
                  <LayoutWrapper showHeader={true} showFooter={true}>
                    <Page>
                      <PaymentSuccess />
                    </Page>
                  </LayoutWrapper>
                }
              />
              <Route
                path="/booking1"
                element={
                  <LayoutWrapper showHeader={false} showFooter={false}>
                    <RequireAuth>
                      <Page>
                        <Booking1 />
                      </Page>
                    </RequireAuth>
                  </LayoutWrapper>
                }
              />
              <Route
                path="/signup"
                element={
                  <LayoutWrapper showHeader={true} showFooter={false}>
                    <Page>
                      <Signup />
                    </Page>
                  </LayoutWrapper>
                }
              />
              <Route
                path="/signup-success"
                element={
                  <LayoutWrapper showHeader={true} showFooter={false}>
                    <Page>
                      <SignupSuccess />
                    </Page>
                  </LayoutWrapper>
                }
              />
              <Route
                path="/verify-email"
                element={
                  <LayoutWrapper showHeader={true} showFooter={false}>
                    <Page>
                      <VerifyEmail />
                    </Page>
                  </LayoutWrapper>
                }
              />
              <Route
                path="/profilePage"
                element={
                  <LayoutWrapper showHeader={true} showFooter={true}>
                    <Page>
                      <Profile />
                    </Page>
                  </LayoutWrapper>
                }
              />
              <Route
                path="/login"
                element={
                  <LayoutWrapper showHeader={true} showFooter={false}>
                    <Page>
                      <Login />
                    </Page>
                  </LayoutWrapper>
                }
              />
              <Route
                path="/forgetPassword"
                element={
                  <LayoutWrapper showHeader={true} showFooter={false}>
                    <Page>
                      <ForgetPassword />
                    </Page>
                  </LayoutWrapper>
                }
              />
              <Route
                path="/otp"
                element={
                  <LayoutWrapper showHeader={true} showFooter={false}>
                    <Page>
                      <Otp />
                    </Page>
                  </LayoutWrapper>
                }
              />
              <Route
                path="/passwordReset"
                element={
                  <LayoutWrapper showHeader={true} showFooter={false}>
                    <Page>
                      <PasswordReset />
                    </Page>
                  </LayoutWrapper>
                }
              />
              <Route
                path="/allPlans"
                element={
                  <LayoutWrapper showHeader={true} showFooter={true}>
                    <Page>
                      <AllPlans />
                    </Page>
                  </LayoutWrapper>
                }
              />
              <Route path="/planDetail/:id" element={<PlanDetailRedirect />} />
              <Route
                path="/planDetails/:id"
                element={
                  <LayoutWrapper showHeader={true} showFooter={true}>
                    <Page>
                      <PlanDetailsPage />
                    </Page>
                  </LayoutWrapper>
                }
              />
              <Route
                path="/review"
                element={
                  <LayoutWrapper showHeader={true} showFooter={true}>
                    <Page>
                      <ReviewPage />
                    </Page>
                  </LayoutWrapper>
                }
              />
              <Route
                path="/admin/sections"
                element={
                  <LayoutWrapper showHeader={true} showFooter={false}>
                    <RequireAdmin>
                      <Page>
                        <AdminSections />
                      </Page>
                    </RequireAdmin>
                  </LayoutWrapper>
                }
              />
              <Route
                path="/admin/rag"
                element={
                  <LayoutWrapper showHeader={true} showFooter={false}>
                    <RequireAdmin>
                      <Page>
                        <AdminRag />
                      </Page>
                    </RequireAdmin>
                  </LayoutWrapper>
                }
              />
              <Route
                path="/admin/plans"
                element={
                  <LayoutWrapper showHeader={true} showFooter={false}>
                    <RequireAdmin>
                      <Page>
                        <AdminPlans />
                      </Page>
                    </RequireAdmin>
                  </LayoutWrapper>
                }
              />
              <Route
                path="/"
                element={
                  <LayoutWrapper showHeader={true} showFooter={true}>
                    <Page>
                      <Home />
                    </Page>
                  </LayoutWrapper>
                }
              />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
