import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useClerk, RedirectToSignIn } from '@clerk/clerk-react';

const Sidebar = () => {
  const { signOut } = useClerk();
  const [shouldRedirect, setShouldRedirect] = React.useState(false);

  const logout = async () => {
    await signOut();       
    setShouldRedirect(true); 
  };

  const navItemClass = ({ isActive }) =>
    `block px-4 py-2 rounded hover:bg-blue-100 ${
      isActive ? 'bg-blue-500 text-white' : 'text-gray-700'
    }`;

    if (shouldRedirect) {
      return <RedirectToSignIn />;
    }

  return (
    <div className="w-64 min-h-screen bg-white shadow-md px-4 py-6">
      <h2 className="text-xl font-bold mb-8 text-blue-600">Loan Recovery</h2>
      <nav className="space-y-2">
        <NavLink to="/dashboard" className={navItemClass}>
          Dashboard
        </NavLink>
        <NavLink to="/borrowers" className={navItemClass}>
          Borrowers
        </NavLink>
        <NavLink to="/analytics" className={navItemClass}>
          Analytics
        </NavLink>
        <NavLink to="/reminders" className={navItemClass}>
          Reminders
        </NavLink>
        <button
          onClick={logout}
          className="w-full text-left text-red-600 mt-10 cursor-pointer hover:underline"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
