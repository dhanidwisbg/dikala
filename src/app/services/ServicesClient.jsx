'use client';

import { useState, useRef } from 'react';

const packages = [
  {
    name: 'Sendiri',
    price: 'Rp.250.000',
    features: ['1 Hours Session', '25 High-Res Edits', 'Unlimited Shots', 'Second Shooter'],
  },
  {
    name: 'Berdua',
    price: 'Rp.300.000',
    features: ['1 Hour Session', '30 High-Res Edits', 'Unlimited Shots', 'Second Shooter'],
  },
  {
    name: 'Sekeluarga',
    price: 'Rp.350.000',
    features: ['1 Hours Session', '40 High-Res Edits', 'Unlimited Shots', 'Second Shooter'],
  },
];

export default function ServicesClient() {
  const formRef = useRef(null);

  const [selectedPackage, setSelectedPackage] = useState(packages[0].name);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleSelectPackage = (pkgName) => {
    setSelectedPackage(pkgName);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendWhatsApp = (e) => {
    e.preventDefault();

    const message = `Halo DIKALA Photography! 👋%0A%0ASaya ingin booking sesi foto dengan detail:%0A- *Nama:* ${encodeURIComponent(name)}%0A- *No. WhatsApp:* ${encodeURIComponent(phone)}%0A- *Paket:* ${encodeURIComponent(selectedPackage)}%0A- *Tanggal Sesi:* ${encodeURIComponent(eventDate || 'Menyusul')}%0A- *Lokasi:* ${encodeURIComponent(location || 'Medan')}%0A${notes ? `- *Catatan Tambahan:* ${encodeURIComponent(notes)}%0A` : ''}%0AMohon info ketersediaan jadwalnya ya. Terima kasih!`;

    const whatsappUrl = `https://wa.me/6281260346719?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="text-white text-sm uppercase tracking-widest font-bold mb-2 block">
          Investment
        </span>
        <h1 className="font-serif text-4xl md:text-6xl text-white mb-6">Services &amp; Pricing</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Penawaran harga transparan untuk dokumentasi momen berharga Anda.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className={`bg-gray-950 border p-8 rounded-sm transition-all duration-300 relative group flex flex-col justify-between ${
              selectedPackage === pkg.name
                ? 'border-white shadow-xl shadow-white/5'
                : 'border-gray-800 hover:border-gray-600'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-serif text-2xl text-white">{pkg.name}</h3>
                {selectedPackage === pkg.name && (
                  <span className="text-[10px] bg-white text-black font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">
                    Selected
                  </span>
                )}
              </div>
              <p className="text-white text-3xl font-bold mb-6">{pkg.price}</p>
              <ul className="text-gray-400 space-y-4 mb-8 text-sm">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="text-white">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => handleSelectPackage(pkg.name)}
              className={`block w-full py-3 text-center rounded-sm transition-all uppercase text-xs tracking-widest font-bold ${
                selectedPackage === pkg.name
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'border border-gray-700 text-white hover:border-white hover:bg-white hover:text-black'
              }`}
            >
              Pilih Paket Ini
            </button>
          </div>
        ))}
      </div>

      {/* Interactive Booking Inquiry Form */}
      <div ref={formRef} className="max-w-3xl mx-auto bg-gray-950 border border-gray-800 rounded-sm p-8 md:p-12 shadow-2xl">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2 block">
            Direct Inquiry
          </span>
          <h2 className="font-serif text-3xl text-white mb-3">Reservasi Jadwal Foto</h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Isi formulir di bawah ini dan kami akan langsung merespons via WhatsApp resmi DIKALA.
          </p>
        </div>

        <form onSubmit={handleSendWhatsApp} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">
                Nama Lengkap *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth: Sarah Maharani"
                className="w-full bg-black border border-gray-800 text-white rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">
                Nomor WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="cth: 08123456789"
                className="w-full bg-black border border-gray-800 text-white rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">
                Pilihan Paket
              </label>
              <select
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="w-full bg-black border border-gray-800 text-white rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
              >
                {packages.map((pkg) => (
                  <option key={pkg.name} value={pkg.name}>
                    Paket {pkg.name} ({pkg.price})
                  </option>
                ))}
                <option value="Custom / Konsultasi Dulu">Custom / Konsultasi Dulu</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">
                Rencana Tanggal Sesi
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-black border border-gray-800 text-white rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">
              Lokasi / Tempat Sesi (Opsional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="cth: Studio / Outdoor USU / Lapangan Merdeka"
              className="w-full bg-black border border-gray-800 text-white rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">
              Catatan / Permintaan Khusus
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ceritakan konsep foto yang Anda inginkan..."
              className="w-full bg-black border border-gray-800 text-white rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors resize-none"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-sm transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-lg shadow-emerald-950"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Kirim Reservasi via WhatsApp</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
