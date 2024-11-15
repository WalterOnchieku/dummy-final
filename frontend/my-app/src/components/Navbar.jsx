import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for auth token on mount to persist login state
    const authToken = localStorage.getItem('authToken');
    if (authToken) setIsLoggedIn(true);
  }, [setIsLoggedIn]);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    sessionStorage.clear();

    // Update logged-in state and redirect to login
    setIsLoggedIn(false);
    navigate('/login');
  };

  
  return (
    <nav>
      <ul>
         <li><Link to="/">Home</Link></li>
         <li><Link to="/users">Users</Link></li>
         <li><Link to="/animals">Animals</Link></li>
         <li><Link to="/vendors">Vendors</Link></li>
         <li><Link to="/products">Products</Link></li> 
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
         
      </ul>
    </nav>
  );
};

export default Navbar;
