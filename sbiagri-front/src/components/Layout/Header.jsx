import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-green-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌾</span>
            <span className="text-xl font-bold">SbiAgri</span>
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-green-200 transition">Dashboard</Link>
            <Link to="/cultures" className="hover:text-green-200 transition">Cultures</Link>
            <Link to="/tasks" className="hover:text-green-200 transition">Tâches</Link>
            <Link to="/stocks" className="hover:text-green-200 transition">Stocks</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <span className="text-sm hidden md:inline">👤 {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}