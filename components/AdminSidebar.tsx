'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin/bookings', label: 'Bookings' },
    { href: '/admin/services', label: 'Services' },
    { href: '/admin/hours', label: 'Business Hours' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#059669]">Zuro Admin</h1>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              block px-4 py-3 rounded-lg transition-colors
              ${pathname === item.href
                ? 'bg-[#059669] text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }
            `}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 pt-8 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-left"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

