import { Outlet } from 'react-router';

export default function Layout() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Customer-facing layout - will be built later */}
      <header className="border-b border-gray-200 dark:border-gray-700 p-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Harish Cloths
        </h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
