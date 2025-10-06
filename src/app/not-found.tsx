import Link from 'next/link';
import { FiHome, FiSearch } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It may have been moved or deleted.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
          >
            <FiHome className="h-5 w-5" />
            <span>Go Home</span>
          </Link>
          
          <Link
            href="/products"
            className="inline-flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-white transition-colors font-semibold"
          >
            <FiSearch className="h-5 w-5" />
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

