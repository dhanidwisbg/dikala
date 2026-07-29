'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CATEGORIES = [
  'Portrait',
  'Wedding',
  'Street',
  'Nature',
  'Night',
  'Abstract',
  'Event',
];

export default function CreateAlbumPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [files, setFiles] = useState([]);
  const [coverIndex, setCoverIndex] = useState(0);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (coverIndex === index) setCoverIndex(0);
    else if (coverIndex > index) setCoverIndex(coverIndex - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (files.length === 0) {
      setError('Please add at least one photo');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('category', category === 'Custom' ? customCategory.trim() : category);
    formData.append('date', date);
    formData.append('coverIndex', coverIndex.toString());
    
    files.forEach((file) => {
      formData.append('photos', file);
    });

    try {
      const res = await fetch('/api/albums', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create album');
      }

      router.push('/admin');
      router.refresh(); // Force refresh to see new data
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto admin-zone">
      <div className="mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm font-medium tracking-widest uppercase"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-sm p-8 md:p-10">
        <h1 className="font-serif text-3xl text-white mb-8 border-b border-gray-800 pb-4">Create New Album</h1>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-sm mb-8">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm uppercase tracking-widest text-gray-400 mb-2">Album Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black border border-gray-700 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-white transition-colors"
                placeholder="e.g. Ethereal Moments"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm uppercase tracking-widest text-gray-400 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-black border border-gray-700 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-white transition-colors"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm uppercase tracking-widest text-gray-400 mb-2">Category</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full sm:w-1/2 bg-black border border-gray-700 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-white transition-colors appearance-none"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  <option value="Custom">Custom...</option>
                </select>
                {category === 'Custom' && (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full sm:w-1/2 bg-black border border-gray-700 text-white rounded-sm px-4 py-3 focus:outline-none focus:border-white transition-colors"
                    placeholder="Enter custom category"
                    required
                  />
                )}
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm uppercase tracking-widest text-gray-400">Photos</label>
              <span className="text-xs text-gray-500">{files.length} selected</span>
            </div>
            
            {/* Dropzone / Upload button */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-700 hover:border-gray-500 bg-black/50 rounded-sm p-8 text-center cursor-pointer transition-colors mb-6"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="hidden"
              />
              <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p className="text-gray-400 font-medium">Click to select photos</p>
              <p className="text-gray-600 text-sm mt-1">High-res JPG/PNG files</p>
            </div>

            {/* Photo Grid Preview */}
            {files.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-3">Click the star icon to set as cover image.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {files.map((file, idx) => {
                    const isCover = coverIndex === idx;
                    return (
                      <div key={idx} className={`relative group aspect-square rounded-sm overflow-hidden border-2 ${isCover ? 'border-white' : 'border-transparent'}`}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setCoverIndex(idx); }}
                            className={`p-2 rounded-full ${isCover ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                            title="Set as Cover"
                          >
                            <svg className="w-5 h-5" fill={isCover ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                            className="p-2 text-red-400 hover:text-red-300 rounded-full"
                            title="Remove Photo"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        {isCover && (
                          <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 text-[10px] uppercase tracking-widest text-white rounded-sm">
                            Cover
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-800 text-right">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-white text-black font-medium rounded-sm hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : 'Create Album'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
