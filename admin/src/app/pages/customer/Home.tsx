import { Link } from 'react-router';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Harish Cloths</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Premium Indian fabrics for all your needs
        </p>
        <Link
          to="/admin"
          className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700"
        >
          Go to Admin Panel
        </Link>
      </div>
    </div>
  );
}
