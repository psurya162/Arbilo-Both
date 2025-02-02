import { useState, useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { IoMdMenu, IoMdPerson, IoMdHome, IoMdStats, IoMdPeople } from 'react-icons/io';
import { AdminAuthContext } from '../../context/AdminAuthContext'; // Correct import
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AdminLayout = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { admin, setAdmin } = useContext(AdminAuthContext); // Corrected to use admin from context
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
    setAdmin({ user: null, token: null });
    navigate('/admin-login');
  };

  // Admin navigation links
  const adminNavLinks = [
    { path: '/admin-dashboard', icon: <IoMdHome size={20} />, label: 'Dashboard' },
    { path: '/admin-dashboard/users', icon: <IoMdPeople size={20} />, label: 'Users' },
    { path: '/admin-dashboard/statistics', icon: <IoMdStats size={20} />, label: 'Create ' },
    { path: '/admin-dashboard/profile', icon: <IoMdPerson size={20} />, label: 'Profile' },
  ];

  if (!admin.user) {
    return <div>Loading...</div>; // Show loading while admin data is being fetched
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar (visible on desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 text-white">
        {/* Logo section */}
        <div className="p-4 border-b border-gray-800">
          <NavLink to="/admin-dashboard">
            <img
              src="/assets/images/logo2.png"
              alt="company_logo"
              loading="lazy"
              className="w-32"
            />
          </NavLink>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {adminNavLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
                  }
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-lg p-4">
          <div className="flex justify-between items-center">
            {/* Mobile menu trigger */}
            <div className="md:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <IoMdMenu size={24} />
                  </button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Admin Menu</SheetTitle>
                    <SheetDescription>Navigation and settings</SheetDescription>
                  </SheetHeader>
                  <nav className="mt-6">
                    <ul className="space-y-2">
                      {adminNavLinks.map((link) => (
                        <li key={link.path}>
                          <NavLink
                            to={link.path}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-4 py-3 rounded-lg ${isActive ? 'bg-gray-100' : 'hover:bg-gray-100'}`
                            }
                            onClick={() => setIsSheetOpen(false)}
                          >
                            {link.icon}
                            <span>{link.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            {/* User profile section */}
            <div className="ml-auto">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100">
                    <Avatar>
                      <AvatarImage src="/path/to/avatar.jpg" alt={admin.user.name} />
                      <AvatarFallback>{admin.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">{admin.user.name}</span>
                  </button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Admin Settings</SheetTitle>
                    <SheetDescription>Manage your admin account</SheetDescription>
                  </SheetHeader>
                  <div className="p-4">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                      Logout
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50">
          {/* This is where the nested routes will be rendered */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
