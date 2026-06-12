import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notify } from '../../utils/notification';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '▦' },
  { to: '/readings', label: 'Readings', icon: '≡' },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    notify.info('Logged out');
    navigate('/login');
  };

  return (
    <aside className="flex flex-col h-full bg-white border-r border-green-100">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-green-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <div>
            <p className="font-bold text-green-700 leading-tight text-sm">AQMS</p>
            <p className="text-xs text-gray-400">Air Quality Monitor</p>
          </div>
        </div>
        {/* Close button (mobile only) */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Close menu"
          >
            ✕
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Admin info + logout */}
      <div className="px-4 py-4 border-t border-green-100">
        <p className="text-xs font-medium text-gray-600 truncate">{admin?.name}</p>
        <p className="text-xs text-gray-400 truncate mb-3">{admin?.email}</p>
        <button
          onClick={handleLogout}
          className="w-full text-left text-xs text-red-500 hover:text-red-700 transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
