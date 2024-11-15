import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './components/Routes';
import App from './App';
import './index.css';

// Wrap your routes to match the required format for createBrowserRouter
const router = createBrowserRouter(
  routes.map(route => ({
    ...route, 
    element: <App /> // Ensure App is wrapping everything
  }))
);

const root = ReactDOM.createRoot(document.getElementById('root'));

// Render RouterProvider with the created router
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
