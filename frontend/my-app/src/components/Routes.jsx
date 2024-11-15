import React from 'react';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import UserTable from '../pages/Users';
import Animals from '../pages/animals';
import App from '../App';
import Products from '../pages/Products';
import Vendors from '../pages/Vendors';

const routes = [
  {
    path: "/",
    element: <App />, // App is now a layout component
    children: [
      { path: "", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "users", element: <UserTable /> },
      { path: "animals", element: <Animals /> },
      { path: "products", element: <Products /> },
      { path: "vendors", element: <Vendors /> }

    ],
  },
];

export default routes;
