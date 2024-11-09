import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import LoginScreen from './components/LoginScreen';
import TaxReturnArchive from './components/TaxReturnArchive';
import Calendar from './components/Calendar';
import Sidebar from './components/Sidebar';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentPage={currentPage} onPageChange={handlePageChange} />
      <div className="flex-1">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'archive' && <TaxReturnArchive />}
        {currentPage === 'calendar' && (
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">年間カレンダー</h1>
            <Calendar selectedYear={selectedYear} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;