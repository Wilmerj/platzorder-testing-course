import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Login } from './containers/Login';
import { Orders } from './containers/Orders';
import { Users } from './containers/Users';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  );
};

export default App;