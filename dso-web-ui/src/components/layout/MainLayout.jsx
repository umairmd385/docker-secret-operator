import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen w-full bg-dark overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
