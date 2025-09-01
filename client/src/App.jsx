import { Link, Routes, Route, Navigate } from 'react-router-dom';
import { School } from 'lucide-react';
import AddSchool from './pages/addSchool.jsx';
import ShowSchools from './pages/showSchools.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
            <School className="w-6 h-6" />
            School Directory
          </div>
          <nav className="flex gap-4">
            <Link to="/add" className="text-gray-700 hover:text-blue-600 transition">Add School</Link>
            <Link to="/schools" className="text-gray-700 hover:text-blue-600 transition">View Schools</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto flex-1 p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/add" replace />} />
          <Route path="/add" element={<AddSchool />} />
          <Route path="/schools" element={<ShowSchools />} />
        </Routes>
      </main>
    </div>
  );
}
