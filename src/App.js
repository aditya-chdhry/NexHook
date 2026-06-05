import { Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import MainWebsite   from './MainWebsite';
import BlogPage      from './sections/BlogPage';
import BlogPost      from './sections/BlogPost';
import AdminLogin    from './admin/AdminLogin';
import AdminLayout   from './admin/AdminLayout';
import Dashboard     from './admin/Dashboard';
import Leads         from './admin/Leads';
import Invoices      from './admin/Invoices';
import Clients       from './admin/Clients';
import Payments      from './admin/Payments';
import Tasks         from './admin/Tasks';
import Settings      from './admin/Settings';
import Meetings      from './admin/Meetings';
import LeadAutomation from './admin/LeadAutomation';
import SocialManager from './admin/SocialManager';
import SalesTeam     from './admin/SalesTeam';
import ChatbotData   from './admin/ChatbotData';
import PrintInvoice  from './admin/PrintInvoice';
import ProtectedRoute from './admin/ProtectedRoute';
import './App.css';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/"             element={<MainWebsite />} />
        <Route path="/blogs"        element={<BlogPage />} />
        <Route path="/blogs/:id"    element={<BlogPost />} />
        <Route path="/admin-login"  element={<AdminLogin />} />
        <Route path="/admin"        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index                    element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"         element={<Dashboard />} />
          <Route path="leads"             element={<Leads />} />
          <Route path="invoices"          element={<Invoices />} />
          <Route path="clients"           element={<Clients />} />
          <Route path="payments"          element={<Payments />} />
          <Route path="tasks"             element={<Tasks />} />
          <Route path="meetings"          element={<Meetings />} />
          <Route path="lead-automation"   element={<LeadAutomation />} />
          <Route path="social-manager"    element={<SocialManager />} />
          <Route path="sales-team"        element={<SalesTeam />} />
          <Route path="chatbot-data"      element={<ChatbotData />} />
          <Route path="settings"          element={<Settings />} />
        </Route>
        <Route path="/admin/invoices/:id/print" element={<ProtectedRoute><PrintInvoice /></ProtectedRoute>} />
      </Routes>
      <Analytics />
    </>
  );
}
