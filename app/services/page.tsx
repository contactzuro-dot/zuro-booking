import Link from 'next/link';
import ServiceList from '@/components/ServiceList';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-[#059669]">
              Zuro
            </Link>
            <div className="flex space-x-4">
              <Link
                href="/services"
                className="text-gray-700 hover:text-[#059669] transition-colors"
              >
                Services
              </Link>
              <Link
                href="/admin"
                className="text-gray-700 hover:text-[#059669] transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Services</h1>
        <ServiceList />
      </main>
    </div>
  );
}

