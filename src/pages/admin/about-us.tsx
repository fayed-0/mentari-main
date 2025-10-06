import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import (code-splitting) the table component (will create soon)
const AboutUsTable = dynamic(() => import('../../components/admin/AboutUsTable'), { ssr: false });

const AboutUsAdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold mb-4">Kelola About Us</h1>
        <p className="text-gray-600 mb-6 text-sm">Tambah, edit, sembunyikan (hide/show) atau hapus item. Data sementara disimpan di localStorage sampai backend/database siap.</p>
        <AboutUsTable />
      </div>
    </div>
  );
};

export default AboutUsAdminPage;
