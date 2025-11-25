import React, { useState, useEffect } from "react";
import {
  useLocation,
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import ScrollToTop from "./components/ScrollToTop";

// Landing Page Components
import Header from "./pages/landing/Components/Hearder";
import Footer from "./pages/landing/Components/Footer";
import Preloader from "./pages/landing/Components/Preloader";
import Home from "./pages/landing/pages/Home";
import Solutions from "./pages/landing/pages/solutions";
import WhyRMS from "./pages/landing/pages/whyrms";
import AboutUs from "./pages/landing/pages/Aboutus";
import Contact from "./pages/landing/pages/Contact";
import NotFound from "./pages/landing/pages/NotFound";
import JitHeader from "./pages/landing/Components/JITHeader";

// Auth Components
import ForgotPassword from "./pages/auth/Forgot";
import Login from "./pages/auth/Login";
import HRRegister from "./pages/auth/HRRegister";
import CandidateRegister from "./pages/auth/candidateRegister";
import ResetPassword from "./pages/auth/ResetPassword";
import ChangePassword from "./pages/auth/ChangePassword";

// Layouts
import HRLayout from "./layouts/HRLayout";
import CompanyAdminLayout from "./layouts/companyAdminLayout";
import CandidateLayout from "./layouts/candidateLayout";

// HR Pages
import HRDashboard from "./pages/hr/Dashboard";
import UploadResume from "./pages/hr/UploadResume";
import ManageJD from "./pages/hr/Managejd";
import InterviewScore from "./pages/hr/InterviewScore";
import JDListStatus from "./pages/hr/JD/JDListStatus";
import InterviewDetail from "./pages/hr/InterviewDetail";

// Company Admin Pages
import CompanyAdminDashboard from "./pages/companyAdmin/HR/Home";
import Profile from "./pages/companyAdmin/HR/Profile";
import HRProfilePage from "./pages/companyAdmin/HR/HRProfilenew";
import ManageHR from "./pages/companyAdmin/HR/ManageHR";
import HrVsJd from "./pages/companyAdmin/HR/analytics/HrVsJd";
import JdVsMonths from "./pages/companyAdmin/HR/analytics/JdVsMonths";
import AppliedJdVsJd from "./pages/companyAdmin/HR/analytics/AppliedJdVsJd";
import ViewHR from "./pages/companyAdmin/HR/ViewHR";
import Notifications from "./pages/companyAdmin/HR/Notifications";
import SettingsScreen from "./pages/common/Sttings";
import HRList from "./pages/companyAdmin/HR/HRListnew";
import CreateHR from "./pages/companyAdmin/HR/CreateHR";

// Candidate Pages
import Application from "./pages/Candidate/Application";
import CandidateDashboard from "./pages/Candidate/Dashboard";
import CandidateProfile from "./pages/Candidate/Profile";

// Super Admin Components
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import SuperAdminHome from "./pages/auth/superAdmin/dashboard";
import SubSuperAdminManager from "./pages/auth/superAdmin/SubAdmin/subadminList";
import CompanyManager from "./pages/auth/superAdmin/company/companyList";
import FeedbackCenter from "./pages/auth/superAdmin/feedbackCenter";
import SupportCenter from "./pages/common/HelpSupport";
import ConfirmCode from "./pages/auth/confrimCode";

// Ticket Components
import MyTickets from "./pages/tickets/MyTickets";
import RaiseTicket from "./pages/tickets/RaiseTicket";
import TicketDetail from "./pages/tickets/ticketDetail";
import SubAdminTickets from "./pages/tickets/SubAdminTickets";
import AdminTicketList from "./pages/tickets/AdminTicketList";

// Interview web
import Instruction from "./pages/Interview_web/Instruction";
import Interview from "./pages/Interview_web/Interview";
import CameraUpload from "./pages/Interview_web/CameraUpload";
import PhotoUpload from "./pages/Interview_web/PhotoUpload";
import InterviewDeepika from "./pages/InterviewDeepika";


const AppContent = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [location]);

  // check dashboard routes
  const isDashboardRoute = () => {
    const isSuperAdminDashboard =
      location.pathname === "/super-admin/dashboard" ||
      location.pathname === "/super-admin/sub-admins" ||
      location.pathname === "/super-admin/companies" ||
      location.pathname === "/super-admin/feedback" ||
      location.pathname === "/super-admin/support" ||
      location.pathname === "/super-admin/settings" ||
      location.pathname === "/super-admin/tickets";

    return (
      location.pathname.startsWith("/hr/") ||
      location.pathname.startsWith("/company/") ||
      location.pathname.startsWith("/candidate/") ||
      isSuperAdminDashboard
    );
  };

  // 🚀 Routes with no header/footer
  const interviewRoutes = [
    "/instructions",
    "/interview",
    "/cameraupload",
    "/photoupload",
    "/InterviewDeepika",
  ];

  const isInterviewRoute = interviewRoutes.includes(location.pathname);

  return (
    <>
      {isLoading ? (
        <Preloader isVisible={true} />
      ) : (
        <div className="min-h-screen flex flex-col">
          {/* ❌ No headers on dashboard & interview routes */}
          {!isDashboardRoute() && !isInterviewRoute && (
            <>
              <JitHeader />
              <Header isDashboard={false} />
            </>
          )}

          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/why-rms" element={<WhyRMS />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/forgot" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/hr-register" element={<HRRegister />} />
              <Route path="/candidate-register" element={<CandidateRegister />} />
              <Route path="/confirm-code" element={<ConfirmCode />} />

              {/* HR Routes */}
              <Route path="/hr" element={<HRLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<HRDashboard />} />
                <Route path="managejd" element={<ManageJD />} />
                <Route path="uploadresume" element={<UploadResume />} />
                <Route path="interviewscore" element={<InterviewScore />} />
                <Route path="jdliststatus/:jdId" element={<JDListStatus />} />
                <Route path="profile" element={<HRProfilePage />} />
                <Route path="interview/:id" element={<InterviewDetail />} />
                <Route path="settings" element={<SettingsScreen />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="my-tickets" element={<MyTickets />} />
                <Route path="raise-ticket" element={<RaiseTicket />} />
                <Route path="tickets/:id" element={<TicketDetail />} />
                <Route path="*" element={<Navigate to="/hr/dashboard" replace />} />
              </Route>

              {/* Company Admin Routes */}
              <Route path="/company" element={<CompanyAdminLayout />}>
                <Route
                  path="notifications"
                  element={<Navigate to="dashboard" replace />}
                />
                <Route path="dashboard" element={<CompanyAdminDashboard />} />
                <Route path="analytics" element={<Navigate to="jd-vs-months" replace />} />
                <Route path="analytics/hr-vs-jd" element={<HrVsJd />} />
                <Route path="analytics/jd-vs-months" element={<JdVsMonths />} />
                <Route path="analytics/applied-jd-vs-jd" element={<AppliedJdVsJd />} />
                <Route path="profile" element={<Profile />} />
                <Route path="manage-hr" element={<ManageHR />} />
                <Route path="settings" element={<SettingsScreen />} />
                <Route path="view-hr" element={<ViewHR />} />
                <Route path="hr-list" element={<HRList />} />
                <Route path="hr-profile/new" element={<CreateHR />} />
                <Route path="hr-profile/:id" element={<HRProfilePage />} />
                <Route path="tickets" element={<SubAdminTickets />} />
                <Route path="tickets/:id" element={<TicketDetail />} />
                <Route path="*" element={<Navigate to="/company/dashboard" replace />} />
              </Route>

              {/* Candidate Routes */}
              <Route path="/candidate" element={<CandidateLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<CandidateDashboard />} />
                <Route path="profile" element={<CandidateProfile />} />
                <Route path="applications" element={<Application />} />
                <Route path="settings" element={<SettingsScreen />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="*" element={<Navigate to="/candidate/dashboard" replace />} />
              </Route>

              {/* Super Admin Routes */}
              <Route path="/super-admin" element={<SuperAdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<SuperAdminHome />} />
                <Route path="sub-admins" element={<SubSuperAdminManager />} />
                <Route path="companies" element={<CompanyManager />} />
                <Route path="feedback" element={<FeedbackCenter />} />
                <Route path="support" element={<AdminTicketList />} />
                <Route path="settings" element={<SettingsScreen />} />
                <Route path="tickets" element={<AdminTicketList />} />
                <Route path="tickets/:id" element={<TicketDetail />} />
                <Route
                  path="*"
                  element={<Navigate to="/super-admin/dashboard" replace />}
                />
              </Route>

              {/* Interview web (no layout) */}
              <Route path="/instructions" element={<Instruction />} />
              <Route path="/interview" element={<Interview />} />
              <Route path="/cameraupload" element={<CameraUpload />} />
              <Route path="/photoupload" element={<PhotoUpload />} />

              <Route path="/InterviewDeepika" element={<InterviewDeepika />} />


              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* ❌ No footer on dashboard & interview routes */}
          {!isDashboardRoute() && !isInterviewRoute && <Footer />}
        </div>
      )}
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App;
