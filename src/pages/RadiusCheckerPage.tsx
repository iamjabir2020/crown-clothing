import React, { useState } from 'react';
import { MapPin, CheckCircle, AlertCircle, Compass, Truck, Clock, ShieldCheck, Search, Navigation } from 'lucide-react';
import { DELIVERY_ZONES, flagshipImg } from '../data/mockData';
import { DeliveryZone } from '../types';

export const RadiusCheckerPage: React.FC = () => {
  const [zipInput, setZipInput] = useState('');
  const [checkResult, setCheckResult] = useState<{
    tested: boolean;
    eligible: boolean;
    zone?: DeliveryZone;
    message: string;
  } | null>(null);
  const [simulatedRadius, setSimulatedRadius] = useState<number>(15);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipInput.trim()) return;

    const query = zipInput.trim().toUpperCase();
    const matched = DELIVERY_ZONES.find((z) =>
      query.startsWith(z.zipCodePrefix) || z.zoneName.toLowerCase().includes(query.toLowerCase())
    );

    if (matched) {
      setCheckResult({
        tested: true,
        eligible: true,
        zone: matched,
        message: `Royal Same-Day Express Delivery Confirmed! Your address is located within ${matched.radiusMiles} miles of our Flagship Hub (${matched.zoneName}).`,
      });
    } else {
      setCheckResult({
        tested: true,
        eligible: false,
        message: `Your location is outside our 15-mile Same-Day Royal Express perimeter. White-Glove Next-Day courier and complimentary ground transit are available.`,
      });
    }
  };

  const handleSelectZone = (zone: DeliveryZone) => {
    setZipInput(zone.zipCodePrefix);
    setCheckResult({
      tested: true,
      eligible: true,
      zone,
      message: `Royal Same-Day Express Delivery Confirmed! Your address is located within ${zone.radiusMiles} miles of our Flagship Hub (${zone.zoneName}).`,
    });
    setSimulatedRadius(Math.max(zone.radiusMiles, 5));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title & Introduction */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-sky-600 mb-1">
            <Compass className="w-4 h-4" />
            <span>Geospatial Logistics Radius Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">
            Delivery Radius & Service Zones
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Verify real-time eligibility for our zero-emission electric courier fleet and same-day direct wardrobe delivery.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All 8 Royal Electric Couriers Online</span>
          </div>
        </div>
      </div>

      {/* Interactive Checker Form & Result Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input + Radar Map Visualizer */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-serif-luxury">
              Instant Radius & Coverage Verification
            </h2>
            <p className="text-xs text-slate-600">
              Enter your postal code or neighborhood name (e.g. <button onClick={() => setZipInput('10021')} className="text-rose-600 underline cursor-pointer">10021</button>, <button onClick={() => setZipInput('11201')} className="text-rose-600 underline cursor-pointer">11201</button>, <button onClick={() => setZipInput('SW1A')} className="text-rose-600 underline cursor-pointer">SW1A</button>, or <button onClick={() => setZipInput('90028')} className="text-rose-600 underline cursor-pointer">90028</button>).
            </p>

            <form onSubmit={handleCheck} className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value)}
                  placeholder="Enter Zip / Postal Code (e.g. 10021)..."
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Verify Radius
              </button>
            </form>

            {checkResult && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-2 animate-in fade-in ${
                  checkResult.eligible
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {checkResult.eligible ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span>{checkResult.eligible ? 'Same-Day Royal Dispatch Confirmed' : 'Scheduled White-Glove Available'}</span>
                </div>
                <p className="leading-relaxed text-xs opacity-90">{checkResult.message}</p>

                {checkResult.zone && (
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-200/60 font-mono text-[11px]">
                    <div>
                      <span className="text-emerald-700 block">Radius:</span>
                      <strong>{checkResult.zone.radiusMiles} Miles</strong>
                    </div>
                    <div>
                      <span className="text-emerald-700 block">Estimated Time:</span>
                      <strong>{checkResult.zone.estimatedTime}</strong>
                    </div>
                    <div>
                      <span className="text-emerald-700 block">Order Cutoff:</span>
                      <strong>{checkResult.zone.cutoffHour}</strong>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Interactive Radar Visualizer */}
          <div className="p-6 bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold block">
                  Metropolitan Radial Radar
                </span>
                <h3 className="text-base font-bold text-white font-serif-luxury">
                  Electric Fleet Perimeter ({simulatedRadius} Miles)
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Perimeter:</span>
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={simulatedRadius}
                  onChange={(e) => setSimulatedRadius(Number(e.target.value))}
                  className="w-24 accent-rose-500 cursor-pointer"
                />
                <span className="font-mono text-rose-400 w-8 text-right font-bold">{simulatedRadius}m</span>
              </div>
            </div>

            {/* Radar Canvas / SVG Graphic */}
            <div className="relative aspect-square sm:aspect-[16/10] w-full bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
              <svg className="w-full h-full" viewBox="0 0 400 300">
                {/* Background Concentric Radar Rings */}
                {/* Outer Ring 15m */}
                <circle cx="200" cy="150" r="120" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                <text x="200" y="25" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">15 MILES (MAX SAME-DAY RADIUS)</text>

                {/* Middle Ring 10m */}
                <circle cx="200" cy="150" r="80" fill="none" stroke="#475569" strokeWidth="1" />
                <text x="200" y="65" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">10 MILES</text>

                {/* Inner Ring 5m Express */}
                <circle cx="200" cy="150" r="45" fill="rgba(225, 29, 72, 0.08)" stroke="#e11d48" strokeWidth="1.5" />
                <text x="200" y="100" textAnchor="middle" fill="#f43f5e" fontSize="8" fontFamily="monospace">5 MILES (90-MIN ROYAL EXPRESS)</text>

                {/* Dynamic sweep line */}
                <line x1="200" y1="150" x2="310" y2="70" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.6" />

                {/* Center Flagship Hub Pin */}
                <circle cx="200" cy="150" r="8" fill="#e11d48" />
                <circle cx="200" cy="150" r="16" fill="none" stroke="#e11d48" strokeWidth="1" className="animate-ping" />
                <text x="200" y="172" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="9" fontFamily="sans-serif">
                  Regent Atelier Central Hub
                </text>

                {/* Sample Courier Fleet Dots */}
                <circle cx="160" cy="130" r="4" fill="#38bdf8" />
                <text x="160" y="122" textAnchor="middle" fill="#bae6fd" fontSize="7" fontFamily="sans-serif">RC-042</text>

                <circle cx="240" cy="120" r="4" fill="#38bdf8" />
                <text x="240" y="112" textAnchor="middle" fill="#bae6fd" fontSize="7" fontFamily="sans-serif">RC-018</text>

                <circle cx="220" cy="190" r="4" fill="#38bdf8" />
                <text x="220" y="202" textAnchor="middle" fill="#bae6fd" fontSize="7" fontFamily="sans-serif">RC-007</text>

                <circle cx="140" cy="170" r="4" fill="#38bdf8" />
                <text x="140" y="182" textAnchor="middle" fill="#bae6fd" fontSize="7" fontFamily="sans-serif">RC-011</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Zone Directory Table */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-serif-luxury">
              Verified Metropolitan Coverage Zones
            </h3>
            <p className="text-xs text-slate-500">
              Orders placed before daily cutoff qualify for direct electric van dispatch with garment bags on velvet hangers.
            </p>

            <div className="space-y-3 divide-y divide-slate-100">
              {DELIVERY_ZONES.map((zone) => {
                const isSelected = checkResult?.zone?.zipCodePrefix === zone.zipCodePrefix;
                return (
                  <div
                    key={zone.zipCodePrefix}
                    onClick={() => handleSelectZone(zone)}
                    className={`pt-3 pb-2 px-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-50/80 border border-rose-200 shadow-xs'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded mr-2">
                          {zone.zipCodePrefix}***
                        </span>
                        <strong className="text-xs text-slate-800">{zone.zoneName}</strong>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Same-Day
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-2 text-[11px] text-slate-500 font-mono">
                      <div>
                        <span>Radius:</span> <strong className="text-slate-800">{zone.radiusMiles} mi</strong>
                      </div>
                      <div>
                        <span>Transit:</span> <strong className="text-slate-800">{zone.estimatedTime}</strong>
                      </div>
                      <div>
                        <span>Cutoff:</span> <strong className="text-slate-800">{zone.cutoffHour}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xs border border-slate-200">
            <img
              src={flagshipImg}
              alt="Crown Clothing Flagship Salon Hub"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-white text-xs">
              <span className="font-semibold block">Central Dispatch Hub #01 — Regent Street</span>
              <span className="text-[11px] text-slate-300">Origin point for all 2-hour electric courier routes</span>
            </div>
          </div>

          <div className="p-6 bg-rose-50/60 rounded-2xl border border-rose-100 space-y-3">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              <span>The Royal Wardrobe Guarantee</span>
            </div>
            <p className="text-xs text-rose-900/80 leading-relaxed">
              If your bespoke garments do not arrive within our promised radius window, we credit your delivery surcharge and gift you a complimentary bespoke silk twill pocket square.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
