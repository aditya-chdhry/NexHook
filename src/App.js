import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainWebsite   from './MainWebsite';
import './App.css';

// Lazy load non-homepage routes
const BlogPage = lazy(() => import('./sections/BlogPage'));
const BlogPost = lazy(() => import('./sections/BlogPost'));
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const Dashboard = lazy(() => import('./admin/Dashboard'));
const Leads = lazy(() => import('./admin/Leads'));
const Invoices = lazy(() => import('./admin/Invoices'));
const Clients = lazy(() => import('./admin/Clients'));
const Payments = lazy(() => import('./admin/Payments'));
const Tasks = lazy(() => import('./admin/Tasks'));
const Settings = lazy(() => import('./admin/Settings'));
const Meetings = lazy(() => import('./admin/Meetings'));
const LeadAutomation = lazy(() => import('./admin/LeadAutomation'));
const SocialManager = lazy(() => import('./admin/SocialManager'));
const SalesTeam = lazy(() => import('./admin/SalesTeam'));
const ChatbotData = lazy(() => import('./admin/ChatbotData'));
const PrintInvoice = lazy(() => import('./admin/PrintInvoice'));
const ProtectedRoute = lazy(() => import('./admin/ProtectedRoute'));
const AdminBlogs = lazy(() => import('./admin/Blogs'));

export default function App() {
  return (
    <Suspense fallback={<div style={{ background: '#04050a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontFamily: 'sans-serif' }}>Loading...</div>}>
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
          <Route path="blogs"             element={<AdminBlogs />} />
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
    </Suspense>
  );
}
