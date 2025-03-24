import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Eager loaded components (critical or small components)
import PageNotFound from './pages/PageNotFound';
import Home from './pages/Home';

// Lazy loaded components (for better initial load performance)
const Documents = lazy(() => import('./pages/Documents'));
const DocumentView = lazy(() => import('./pages/DocumentView'));

// Loading fallback component
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public routes - Main Layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
          </Route>

          {/* Dashboard and Document routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/documents" element={<Documents />} />
            <Route path="/documents/upload" element={<Documents />} />
            <Route path="/documents/:id" element={<DocumentView />} />
          </Route>

          {/* 404 page */}
          <Route path="/404" element={<PageNotFound />} />
          
          {/* Redirect any unknown paths to 404 */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;