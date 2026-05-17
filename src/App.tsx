import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import AppsPage from './pages/Apps';
import AdminLayout from './components/AdminLayout';
import RolesPage from './pages/admin/Roles';
import UsersPage from './pages/admin/Users';
import OrganizationsPage from './pages/admin/Organizations';
import AppsAdminPage from './pages/admin/Apps';
import OpsOverviewPage from './pages/ops/Overview';
import RequireAuth from './auth/RequireAuth';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/apps" element={<AppsPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/roles" element={<RolesPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/organizations" element={<OrganizationsPage />} />
          <Route path="/admin/apps" element={<AppsAdminPage />} />
          <Route path="/ops/monitor" element={<OpsOverviewPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
