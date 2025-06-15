import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

import Dashboard from './pages/Dashboard';
import Borrowers from './pages/Borrowers';
import BorrowerDetails from './pages/BorrowerDetails';
import Analytics from './pages/Analytics';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/Signinpage';
import LandingPage from './pages/LandingPage';
import Reminders from './pages/Reminders';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        
        <Route
          path="/dashboard"
          element={
            <SignedIn>
              <Dashboard />
            </SignedIn>
          }
        />
        <Route
          path="/borrowers"
          element={
            <SignedIn>
              <Borrowers />
            </SignedIn>
          }
        />
        <Route
          path="/borrower/:id"
          element={
            <SignedIn>
              <BorrowerDetails />
            </SignedIn>
          }
        />
        <Route
          path="/analytics"
          element={
            <SignedIn>
              <Analytics />
            </SignedIn>
          }
        />
        <Route
          path="/reminders"
          element={
            <SignedIn>
              <Reminders />
            </SignedIn>
          }
        />

        <Route path="*" element={<SignedOut><RedirectToSignIn /></SignedOut>} />
      </Routes>
    </Router>
  );
}

export default App;
