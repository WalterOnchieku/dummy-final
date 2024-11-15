import React, { useState } from 'react';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <header>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </header>
      <main>
        <Outlet />
      </main>
        
    </div>
  );
};

export default App;
