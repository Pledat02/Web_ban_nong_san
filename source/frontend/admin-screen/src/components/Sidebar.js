import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  Settings,
  Shield, User
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'dashboard', path: '/' },
    { icon: Users, label: 'users', path: '/users-management' },
    { icon: Shield, label: 'roles', path: '/roles-management' },
    { icon: ShoppingBag, label: 'products', path: '/products-management' },
    { icon: Package, label: 'orders', path: '/orders-management' },
    { icon: Settings, label: 'settings', path: '/settings-management' },
    { icon: User, label: 'Hồ sơ', path: '/profile-management' },
  ];

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-green-600">Admin Portal</h1>
      </div>
      <nav className="p-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-green-50 text-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;