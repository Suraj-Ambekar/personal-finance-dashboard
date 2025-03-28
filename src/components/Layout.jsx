// import { Link, Outlet } from "react-router-dom";

// const Layout = () => {
//   return (
//     <div className="h-screen flex flex-col">
//       {/* Navigation Menu */}
//       <nav className="bg-blue-600 p-4 text-white flex justify-center gap-6 shadow-lg">
//         <Link to="/dashboard" className="hover:underline">
//           Dashboard
//         </Link>
//         <Link to="/transactions" className="hover:underline">
//           Transactions
//         </Link>
//         <Link to="/savings" className="hover:underline">
//           Savings Goals
//         </Link>
//       </nav>

//       {/* Page Content */}
//       <div className="flex-grow p-6">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default Layout;

import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getAuth, signOut } from "firebase/auth";

const Layout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navigation Menu */}
      <nav className="bg-blue-600 p-4 text-white flex items-center justify-between shadow-lg">
        {/* Navigation Links */}
        <div className="flex gap-6">
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/transactions" className="hover:underline">
            Transactions
          </Link>
          <Link to="/savings" className="hover:underline">
            Savings Goals
          </Link>
        </div>

        {/* Logout Button */}
        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </nav>

      {/* Page Content */}
      <div className="flex-grow p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
