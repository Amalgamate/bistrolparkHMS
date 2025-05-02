import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import NewLogin from './pages/NewLogin';
import { useAuth } from './context/AuthContext';
import { NewRoutes } from './routes/NewRoutes';

function NewApp() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <NewLogin />;
  }

  return (
    <BrowserRouter>
      <NewRoutes />
    </BrowserRouter>
  );
}

export default NewApp;
