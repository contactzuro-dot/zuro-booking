import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#059669]">Zuro</h1>
            </div>
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
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Zuro
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Book your services with ease
          </p>
          <Link
            href="/services"
            className="inline-block bg-[#059669] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#047857] transition-colors"
          >
            View Services
          </Link>
        </div>
      </main>
    </div>
  );
}
