'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const MAX_PHOTOS = 10;

export default function AdminDashboard() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editImages, setEditImages] = useState([]);
  const [editCover, setEditCover] = useState('');
  const [newFiles, setNewFiles] = useState([]);
  const [editError, setEditError] = useState('');
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
    setEditData({ ...album });
    setEditImages([...(album.images || [])]);
    setEditCover(album.cover || album.images?.[0] || '');
    setNewFiles([]);
    setEditError('');
    setEditModalOpen(true);
  };

  const handleAddNewFiles = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      const totalCount = editImages.length + newFiles.length + selected.length;

      if (totalCount > MAX_PHOTOS) {
        setEditError(`Maksimal ${MAX_PHOTOS} foto per album. Anda saat ini memiliki ${editImages.length + newFiles.length} foto.`);
        return;
      }

      const oversized = selected.filter(f => f.size > MAX_FILE_SIZE);
      if (oversized.length > 0) {
        setEditError(`File melebihi 2 MB: ${oversized.map(f => f.name).join(', ')}`);
        return;
      }

      setEditError('');
      setNewFiles(prev => [...prev, ...selected]);
    }
  };

  const removeExistingImage = (idx) => {
    const imgToRemove = editImages[idx];
    const updated = editImages.filter((_, i) => i !== idx);
    setEditImages(updated);
    if (editCover === imgToRemove) {
      setEditCover(updated[0] || '');
    }
  };

  const removeNewFile = (idx) => {
    setNewFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (editImages.length + newFiles.length === 0) {
      setEditError('Album minimal harus memiliki 1 foto');
      return;
    }

    setSaving(true);
    setEditError('');

    try {
      if (newFiles.length > 0) {
        // Multipart update
        const formData = new FormData();
        formData.append('title', editData.title.trim());
        formData.append('category', editData.category.trim());
        formData.append('cover', editCover);
        formData.append('existingImages', JSON.stringify(editImages));

        newFiles.forEach((f) => {
          formData.append('newPhotos', f);
        });

        const res = await fetch(`/api/albums/${editData.id}`, {
          method: 'PUT',
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to update album');
        }

        const updated = await res.json();
        setAlbums(albums.map(a => a.id === updated.id ? updated : a));
        setEditModalOpen(false);
      } else {
        // Plain JSON update
        const res = await fetch(`/api/albums/${editData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: editData.title.trim(),
            category: editData.category.trim(),
            images: editImages,
            cover: editCover,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to update album');
        }

        const updated = await res.json();
        setAlbums(albums.map(a => a.id === updated.id ? updated : a));
        setEditModalOpen(false);
      }
    } catch (err) {
      setEditError(err.message || 'Error updating album');
    }
    setSaving(false);
  };

  // Categories list for filter
  const categories = ['All', ...new Set(albums.map(a => a.category).filter(Boolean))];

  // Filtered albums
  const filteredAlbums = albums.filter((album) => {
    const matchesSearch =
      album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'All' || album.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto admin-zone">
      {/* Cloud Mode Banner */}
      <div className="bg-emerald-900/30 border border-emerald-500/30 text-emerald-200 px-4 py-3 rounded-sm mb-8 flex items-center justify-center gap-2">
        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
        <span className="text-sm font-medium tracking-wide">
          Cloud Mode — Terhubung ke Cloud Vercel Blob. Data langsung tersimpan online.
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="font-serif text-4xl text-white mb-2">CMS Dashboard</h1>
          <p className="text-gray-400">Kelola dan update album portofolio Dikala Photography.</p>
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

      {/* Search & Category Filter Bar */}
      <div className="bg-gray-900 border border-gray-800 rounded-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama client atau kategori..."
            className="w-full bg-black border border-gray-800 text-white rounded-sm pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-white transition-colors"
          />
          <svg className="w-4 h-4 text-gray-500 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs uppercase tracking-widest text-gray-500 shrink-0">Kategori:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-black border border-gray-800 text-white rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-white transition-colors"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <span className="text-xs text-gray-500 ml-2">
            ({filteredAlbums.length} album)
          </span>
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
              ) : filteredAlbums.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    {searchQuery ? 'Tidak ada album yang sesuai dengan pencarian.' : 'No albums found. Click "Create New Album" to get started.'}
                  </td>
                </tr>
              ) : (
                filteredAlbums.map((album) => (
                  <tr key={album.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={album.cover}
                          alt=""
                          className="w-16 h-16 object-cover rounded-sm grayscale-off border border-gray-800"
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
                      <span className="px-2 py-1 bg-white/10 rounded-sm text-xs text-white">
                        {album.images?.length || 0}
                      </span>
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

      {/* Advanced Edit Modal */}
      {editModalOpen && editData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-gray-950 border border-gray-700 rounded-md max-w-2xl w-full p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
              <h2 className="font-serif text-2xl text-white">Edit Album: {editData.title}</h2>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {editError && (
              <div className="bg-red-950/60 border border-red-500/40 text-red-200 text-sm px-4 py-3 rounded-sm mb-6">
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-sm text-white focus:outline-none focus:border-white transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Category</label>
                  <input
                    type="text"
                    required
                    value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-black border border-gray-700 rounded-sm text-white focus:outline-none focus:border-white transition-colors text-sm"
                  />
                </div>
              </div>

              {/* Current Photos Management */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest">
                    Kelola Foto Album ({editImages.length + newFiles.length} / {MAX_PHOTOS})
                  </label>
                  <span className="text-[11px] text-gray-500">Klik ikon bintang untuk jadikan Cover</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 p-3 bg-black/60 border border-gray-800 rounded-sm min-h-[120px]">
                  {/* Existing Images */}
                  {editImages.map((imgUrl, idx) => {
                    const isCover = editCover === imgUrl;
                    return (
                      <div key={idx} className={`relative group aspect-square rounded-sm overflow-hidden border-2 ${isCover ? 'border-white' : 'border-gray-800'}`}>
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditCover(imgUrl)}
                            className={`p-1.5 rounded-full ${isCover ? 'text-yellow-400' : 'text-gray-400 hover:text-white'}`}
                            title="Jadikan Cover"
                          >
                            <svg className="w-4 h-4" fill={isCover ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeExistingImage(idx)}
                            className="p-1.5 text-red-400 hover:text-red-300 rounded-full"
                            title="Hapus Foto Ini"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        {isCover && (
                          <div className="absolute top-1 left-1 bg-black/90 px-1 py-0.5 text-[9px] uppercase tracking-widest text-white rounded">
                            Cover
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Newly Added Previews */}
                  {newFiles.map((file, idx) => (
                    <div key={`new-${idx}`} className="relative group aspect-square rounded-sm overflow-hidden border-2 border-emerald-500/50">
                      <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeNewFile(idx)}
                          className="p-1.5 text-red-400 hover:text-red-300 rounded-full"
                          title="Batal Tambah"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="absolute top-1 left-1 bg-emerald-900/90 px-1 py-0.5 text-[9px] uppercase tracking-widest text-emerald-200 rounded">
                        New
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Photos Input */}
              {editImages.length + newFiles.length < MAX_PHOTOS && (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAddNewFiles}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 border border-dashed border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white rounded-sm text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Foto Baru (Max 2MB per foto)
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-5 py-2.5 text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-white text-black font-medium rounded-sm hover:bg-gray-200 transition-colors uppercase tracking-widest text-xs disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
