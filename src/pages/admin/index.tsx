import React from 'react';
import Link from 'next/link';


const mockRows = Array.from({ length: 10 }).map(() => ({
  name: 'Tiger Nixon',
  position: 'System Architect',
  office: 'Edinburgh',
  age: 61,
  startDate: '2011/04/25',
  salary: '$320,800',
}));

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-neutral-100 overflow-hidden font-['Open_Sans']">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 w-full h-24 bg-indigo-500 z-10" />

      <div className="flex pt-4 px-4 gap-4">
        {/* Sidebar */}
        <aside className="mt-4 w-72 h-[calc(100vh-2rem)] bg-white rounded-xl flex flex-col gap-4 py-4 shadow-sm relative z-20">
          <div className="px-8 pt-2 pb-2">
            <div className="text-blue-950 text-xl font-bold">Rs Mentari</div>
          </div>
          <div className="h-px bg-neutral-200/0" />
          <nav className="flex-1 px-2 flex flex-col gap-4 overflow-y-auto">
            <div>
              <ul className="space-y-1">
                <li>
                  <div className="px-4 py-2.5 rounded-sm flex items-center gap-2 text-black text-sm font-medium font-['Be_Vietnam_Pro']">
                    <span className="inline-block size-3 bg-orange-500 rounded-sm" />
                    Dashboard
                  </div>
                </li>
              </ul>
            </div>
            <div className="px-4 text-slate-400 text-xs font-medium font-['Be_Vietnam_Pro'] tracking-wide">PAGES</div>
            <div>
              <ul className="space-y-1">
                <li>
                  <Link href="/admin/healthcare" className="px-4 py-2.5 rounded-sm flex items-center gap-2 text-black text-sm font-medium font-['Be_Vietnam_Pro'] hover:bg-neutral-50">
                    <span className="inline-block size-3 bg-orange-500 rounded-sm" />
                    Healthcare
                  </Link>
                </li>
                <li>
                  <div className="px-4 py-2.5 rounded-sm flex items-center gap-2 text-black text-sm font-medium font-['Be_Vietnam_Pro']">
                    <span className="inline-block size-3 bg-orange-500 rounded-sm" />
                    Ecommerce
                  </div>
                </li>
                <li>
                  <Link href="/admin/about-us" className="px-4 py-2.5 rounded-sm flex items-center gap-2 text-black text-sm font-medium font-['Be_Vietnam_Pro'] hover:bg-neutral-50">
                    <span className="inline-block size-3 bg-orange-500 rounded-sm" />
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          <div className="h-20" />
        </aside>

        {/* Main Card / Content */}
        <main className="mt-24 ml-0 flex-1 pr-4 pb-8">
          <div className="bg-white rounded-2xl w-full min-h-[780px] shadow-sm relative p-6">
            <header className="space-y-1 mb-10">
              <h1 className="text-blue-950 text-xl font-semibold leading-7">Datatable Simple</h1>
              <p className="text-blue-950 text-sm leading-tight max-w-xl">
                A lightweight, extendable, dependency-free javascript HTML table plugin.
              </p>
            </header>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-sm border border-gray-200">
                <span className="text-slate-400 text-sm">10</span>
                <span className="w-2.5 h-5 flex items-center justify-center text-xs text-slate-400">▼</span>
              </div>
              <span className="text-slate-400 text-xs">entries per page</span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="text-slate-400 text-xs font-bold tracking-wide">
                    <th className="py-3 pr-6">NAME</th>
                    <th className="py-3 pr-6 w-48">POSITION</th>
                    <th className="py-3 pr-6 w-40">OFFICE</th>
                    <th className="py-3 pr-6 w-24">AGE</th>
                    <th className="py-3 pr-6 w-32">START DATE</th>
                    <th className="py-3 pr-6 w-32">SALARY</th>
                  </tr>
                  <tr>
                    <td colSpan={6} className="p-0">
                      <div className="h-px w-full bg-zinc-200" />
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {mockRows.map((row, idx) => (
                    <tr key={idx} className="text-slate-400 text-sm">
                      <td className="py-4 pr-6 align-top">{row.name}</td>
                      <td className="py-4 pr-6 align-top w-48">{row.position}</td>
                      <td className="py-4 pr-6 align-top w-40">{row.office}</td>
                      <td className="py-4 pr-6 align-top w-24">{row.age}</td>
                      <td className="py-4 pr-6 align-top w-32">{row.startDate}</td>
                      <td className="py-4 pr-6 align-top w-32">{row.salary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer / Pagination mock */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-slate-400 text-sm">Showing 1 to 10 of 57 entries</p>
              <div className="flex items-center gap-1">
                {['prev', '1', '2', '3', '4', '5', '6', 'next'].map((p, i) => {
                  const isNumber = /\d/.test(p);
                  const selected = p === '1';
                  return (
                    <button
                      key={i}
                      className={`relative size-9 flex items-center justify-center rounded-full text-sm transition shadow ${
                        selected
                          ? 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white'
                          : 'border border-gray-200 text-slate-400 hover:bg-gray-50'
                      }`}
                      disabled={!isNumber}
                    >
                      {isNumber ? p : p === 'prev' ? '<' : '>'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
