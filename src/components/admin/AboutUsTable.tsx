import React, { useEffect, useMemo, useState } from 'react';
import {
  AboutUsItem,
  listAboutUs,
  createAboutUs,
  updateAboutUs,
  deleteAboutUs,
  toggleHide,
  ensureSeed,
} from '../../lib/adminAboutUsStore';

interface FormState {
  id?: string; // if editing
  title: string;
  description: string;
}

const emptyForm: FormState = { title: '', description: '' };

const AboutUsTable: React.FC = () => {
  const [items, setItems] = useState<AboutUsItem[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState('');
  const [showHidden, setShowHidden] = useState(true);

  useEffect(() => {
    ensureSeed();
    setItems(listAboutUs());
  }, []);

  function refresh() {
    setItems(listAboutUs());
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (isEditing && form.id) {
      updateAboutUs(form.id, { title: form.title, description: form.description });
    } else {
      createAboutUs({ title: form.title, description: form.description });
    }
    setForm(emptyForm);
    setIsEditing(false);
    refresh();
  }

  function handleEdit(item: AboutUsItem) {
    setForm({ id: item.id, title: item.title, description: item.description });
    setIsEditing(true);
  }

  function handleDelete(id: string) {
    if (confirm('Hapus item ini?')) {
      deleteAboutUs(id);
      refresh();
    }
  }

  function handleToggleHide(id: string) {
    toggleHide(id);
    refresh();
  }

  function handleCancel() {
    setForm(emptyForm);
    setIsEditing(false);
  }

  const filtered = useMemo(() => {
    return items.filter(i => {
      if (!showHidden && i.isHidden) return false;
      if (search.trim()) {
        const s = search.toLowerCase();
        return i.title.toLowerCase().includes(s) || i.description.toLowerCase().includes(s);
      }
      return true;
    });
  }, [items, search, showHidden]);

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="font-semibold mb-4 text-lg">{isEditing ? 'Edit About Us' : 'Tambah About Us'}</h2>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Judul</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
              placeholder="Masukkan judul"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm h-28"
              placeholder="Masukkan deskripsi"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
            {isEditing ? 'Simpan Perubahan' : 'Tambah'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-md"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="font-semibold text-lg">Daftar About Us</h2>
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari..."
              className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
            />
            <label className="flex items-center gap-1 text-xs md:text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showHidden}
                onChange={e => setShowHidden(e.target.checked)}
                className="rounded border-gray-300"
              />
              Tampilkan yang disembunyikan
            </label>
          </div>
        </div>
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 font-medium">Judul</th>
                <th className="px-4 py-2 font-medium w-1/2">Deskripsi</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap">Status</th>
                <th className="px-4 py-2 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500 text-sm">
                    Tidak ada data
                  </td>
                </tr>
              )}
              {filtered.map(item => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 align-top">
                    <div className="font-medium flex items-center gap-2">
                      {item.title}
                      {item.isHidden && (
                        <span className="inline-block text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">Hidden</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Dibuat: {new Date(item.createdAt).toLocaleString('id-ID')}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 align-top whitespace-pre-wrap">{item.description || '-'}
                    <div className="text-xs text-gray-400 mt-2">Update: {new Date(item.updatedAt).toLocaleString('id-ID')}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.isHidden ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700'}`}> 
                      {item.isHidden ? 'Disembunyikan' : 'Aktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col gap-2 items-end">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleHide(item.id)}
                        className="px-3 py-1.5 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white text-xs"
                      >
                        {item.isHidden ? 'Show' : 'Hide'}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AboutUsTable;
