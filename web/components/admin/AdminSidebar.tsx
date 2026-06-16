'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Coffee, LogOut, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/cafes', label: 'Kelola Cafe', icon: Coffee },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white text-sm">
          <ArrowLeft className="w-4 h-4" />
          Ke Website
        </Link>
        <h1 className="mt-3 text-lg font-bold">Admin Panel</h1>
        <p className="text-xs text-gray-400">Ponorogo Cafe</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
              pathname.startsWith(href)
                ? 'bg-primary-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-red-600 hover:text-white w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
