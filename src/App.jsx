import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import SessionPage from './components/SessionPage';
import TransferPage from './components/TransferPage';

function App() {
  return (
    <SessionProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/session" element={<SessionPage />} />
            <Route path="/transfer" element={<TransferPage />} />
          </Routes>
        </Layout>
      </Router>
    </SessionProvider>
  );
}

export default App;
