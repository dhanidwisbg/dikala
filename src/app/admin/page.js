'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await fetch('/api/albums');
      const data = await res.json();
      setAlbums(data.albums || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/albums/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAlbums(albums.filter(a => a.id !== id));
      } else {
        alert('Failed to delete album');
      }
    } catch (err) {
      alert('Error deleting album');
    }
    setDeletingId(null);
  };

  const openEdit = (album) => {
    setEditData({ ...album, assetFolder: album.assetFolder || '' });
    setEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/albums/${editData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editData.title,
          category: editData.category,
          assetFolder: editData.assetFolder,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setAlbums(albums.map(a => a.id === updated.id ? updated : a));
        setEditModalOpen(false);
      } else {
        alert('Failed to update album');
      }
    } catch (err) {
      alert('Error updating album');
    }
    setSaving(false);
  };

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto admin-zone">
      {/* Cloud Mode Banner */}
      <div className="bg-emerald-900/30 border border-emerald-500/30 text-emerald-200 px-4 py-3 rounded-sm mb-8 flex items-center justify-center gap-2">
        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
        <span className="text-sm font-medium tracking-wide">
          Cloud Mode — Data disimpan di Vercel Blob. Bisa diakses di mana saja.
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="font-serif text-4xl text-white mb-2">CMS Dashboard</h1>
          <p className="text-gray-400">Kelola album portofolio Dikala Photography.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/create"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-medium rounded-sm hover:bg-gray-200 transition-colors uppercase tracking-widest text-xs"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create New Album
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center px-4 py-3 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 rounded-sm transition-colors uppercase tracking-widest text-xs"
            title="Keluar dari Admin"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Albums Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase tracking-widest bg-black/50 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 font-medium">Album</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-center">Photos</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : albums.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No albums found. Click "Create New Album" to get started.
                  </td>
                </tr>
              ) : (
                albums.map((album) => (
                  <tr key={album.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={album.cover}
                          alt=""
                          className="w-16 h-16 object-cover rounded-sm grayscale-off"
                        />
                        <div>
                          <div className="font-serif text-white text-lg">{album.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{album.category}</td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(album.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-center font-medium">
                      {album.images.length}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEdit(album)}
                        className="text-blue-400 hover:text-blue-300 transition-colors p-2"
                        title="Edit Album"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(album.id, album.title)}
                        disabled={deletingId === album.id}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 disabled:opacity-50"
                        title="Delete Album"
                      >
                        {deletingId === album.id ? (
                          <div className="w-5 h-5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && editData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-md max-w-md w-full p-6 shadow-2xl animate-fade-in-up">
            <h2 className="font-serif text-2xl text-white mb-6">Edit Album</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-sm text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Category</label>
                <input
                  type="text"
                  required
                  value={editData.category}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-sm text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Assets Folder (e.g., 1, 2, 3)</label>
                <input
                  type="text"
                  required
                  value={editData.assetFolder}
                  onChange={(e) => setEditData({ ...editData, assetFolder: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-sm text-white focus:outline-none focus:border-white transition-colors"
                />
                <p className="text-xs text-gray-500 mt-2">Images will be automatically loaded from <code>public/assets/{'{folder}'}</code></p>
              </div>
              <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-6 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-white text-black font-medium rounded-sm hover:bg-gray-200 transition-colors uppercase tracking-widest text-xs disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
