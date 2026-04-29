import { Navigate, Route, Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './pages/Login';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/Dashboard';
import ComponentLibPage from './pages/Apps/ComponentLib';
import KnowledgeQAPage from './pages/Apps/KnowledgeQA';
import CodeGenPage from './pages/Apps/CodeGen';
import CodeReviewPage from './pages/Apps/CodeReview';
import CircuitReviewPage from './pages/Apps/CircuitReview';
import MeetingPage from './pages/Apps/Meeting';
import PPTPage from './pages/Apps/PPT';
import UserManagePage from './pages/System/UserManage';
import AppConfigPage from './pages/System/AppConfig';
import OperationLogPage from './pages/System/OperationLog';
import { isLoggedIn } from './utils/auth';

function RequireAuth({ children }: { children: JSX.Element }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="apps">
            <Route path="components" element={<ComponentLibPage />} />
            <Route path="knowledge" element={<KnowledgeQAPage />} />
            <Route path="codegen" element={<CodeGenPage />} />
            <Route path="codereview" element={<CodeReviewPage />} />
            <Route path="circuit" element={<CircuitReviewPage />} />
            <Route path="meeting" element={<MeetingPage />} />
            <Route path="ppt" element={<PPTPage />} />
          </Route>
          <Route path="system">
            <Route path="users" element={<UserManagePage />} />
            <Route path="config" element={<AppConfigPage />} />
            <Route path="logs" element={<OperationLogPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
