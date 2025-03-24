import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Documents from './pages/Documents';
import DocumentView from './pages/DocumentView';
import Header from './components/common/Header';

// Create a layout component that includes Header
const Layout = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
  </>
);

// Create routes with the Layout wrapper
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Home /></Layout>,
  },
  {
    path: '/documents',
    element: <Layout><Documents /></Layout>,
  },
  {
    path: '/documents/:documentId',
    element: <Layout><DocumentView /></Layout>,
  },
  {
    path: '*',
    element: <Layout><div>Page not found</div></Layout>,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;