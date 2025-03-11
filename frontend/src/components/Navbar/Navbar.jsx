import { Link } from "react-router-dom";

const Navbar = ({ isAuthenticated, onLogout }) => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex items-center justify-between">
      {/* Left Side - My App */}
      <div className="text-lg font-bold">My App</div>

      {/* Center - Navigation Links */}
      <div className="flex-1 flex justify-center space-x-6">
        <Link to="/" className="hover:underline">Home</Link>
        {isAuthenticated && <Link to="/dashboard" className="hover:underline">Dashboard</Link>}
        {isAuthenticated && <Link to="/map" className="hover:underline">Map</Link>}
      </div>

      {/* Right Side - Login/Logout */}
      <div>
        {isAuthenticated ? (
          <button onClick={onLogout} className="bg-red-500 px-4 py-2 rounded">
            Logout
          </button>
        ) : (
          <Link to="/login" className="bg-green-500 px-4 py-2 rounded">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
