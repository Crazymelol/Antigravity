import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Athletes from './components/Athletes';
import Competitions from './components/Competitions';
import AttendanceTracker from './components/AttendanceTracker';
import Login from './components/Login';
import ErrorBoundary from './components/ErrorBoundary';
import ParentLayout from './components/ParentLayout';
import ParentDashboard from './components/ParentDashboard';
import AdminDashboard from './components/AdminDashboard';
import RefereeManager from './components/RefereeManager';
import QRCheckIn from './components/QRCheckIn';
import Inventory from './components/Inventory';
import LessonBooking from './components/LessonBooking';
import AthleteSchedule from './components/AthleteSchedule';
import BadgeGenerator from './components/BadgeGenerator';
import StripView from './components/StripView';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Parent Routes */}
      <Route path="/parent" element={
        <ProtectedRoute>
          <ParentLayout />
        </ProtectedRoute>
      }>
        <Route index element={<ParentDashboard />} />
        {/* Child Routes could go here, e.g., /parent/schedule */}
      </Route>

      {/* Admin Route */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Coach/Athlete Routes (Legacy Default) */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="athletes" element={<Athletes />} />
        <Route path="competitions" element={<Competitions />} />
        <Route path="attendance" element={<AttendanceTracker />} />
        <Route path="referees" element={<RefereeManager />} />
        <Route path="qr-checkin" element={<QRCheckIn />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="lessons" element={<LessonBooking />} />
        <Route path="schedule" element={<AthleteSchedule />} />
        <Route path="badges" element={<BadgeGenerator />} />
        <Route path="strips" element={<StripView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
