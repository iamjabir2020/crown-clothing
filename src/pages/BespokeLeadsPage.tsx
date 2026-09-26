import React, { useState } from 'react';
import { Award, Calendar, Clock, CheckCircle2, UserCheck, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { BespokeLead } from '../types';
import { craftsmanshipImg } from '../data/mockData';
import { handleImageError } from '../utils/imageResolver';

interface BespokeLeadsPageProps {
  onAddLead: (lead: BespokeLead) => void;
  onNavigate: (page: string) => void;
}

export const BespokeLeadsPage: React.FC<BespokeLeadsPageProps> = ({ onAddLead, onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    serviceType: 'Bespoke Tailoring' as BespokeLead['serviceType'],
    preferredDate: '',
    fittingLocation: 'Flagship Regent Atelier' as 'Flagship Regent Atelier' | 'Private Residence / Penthouse' | 'Virtual Video Fitting',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [createdLeadId, setCreatedLeadId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) return;

    const newId = `lead-${Math.floor(100 + Math.random() * 900)}`;
    const newLead: BespokeLead = {
      id: newId,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      serviceType: formData.serviceType,
      preferredDate: formData.preferredDate || 'Flexible / Next Available',
      notes: `${formData.fittingLocation} — ${formData.notes || 'No custom notes provided.'}`,
      status: 'New',
      createdAt: 'Just now',
    };

    onAddLead(newLead);
    setCreatedLeadId(newId);
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title & Introduction */}
      <div className="border-b border-slate-200 pb-6 text-center max-w-2xl mx-auto space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-rose-600">
          <Award className="w-4 h-4" />
          <span>Haute Couture & Savile Row Standards</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">
          VIP Bespoke Consultation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Commission a one-of-a-kind garment hand-cut to your exact measurements by our Master Tailor. Available at our Regent Street salon or via private penthouse appointment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Form or Confirmation */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-10 space-y-5 animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold font-mono">
                  Reference #{createdLeadId}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 font-serif-luxury">
                  Consultation Request Registered
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-slate-900">{formData.fullName}</strong>. Our Master Tailor concierge has received your dossier and will reach out via <strong className="text-slate-900">{formData.phone}</strong> within 4 business hours to finalize your appointment.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl text-left text-xs space-y-2 max-w-md mx-auto border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Commission:</span>
                  <span className="font-semibold text-slate-900">{formData.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fitting Venue:</span>
                  <span className="font-semibold text-slate-900">{formData.fittingLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Preferred Target Date:</span>
                  <span className="font-mono text-slate-900">{formData.preferredDate || 'Immediate'}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
                <button
                  onClick={() => onNavigate('admin')}
                  className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  View in Admin Console
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-serif-luxury">
                  Request a Private Fitting Dossier
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Please provide your contact details for our personal client director.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Lord Julian Sterling"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Direct Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confidential Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="julian@sterling.com"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bespoke Discipline
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-rose-500"
                  >
                    <option value="Bespoke Tailoring">Bespoke Two/Three-Piece Suit</option>
                    <option value="Wedding & Formal">Wedding & Gala Formalwear</option>
                    <option value="VIP Private Wardrobe">Seasonal Wardrobe Capsule</option>
                    <option value="Corporate Gifting">Corporate Executive Gifting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fitting Venue Preference
                  </label>
                  <select
                    value={formData.fittingLocation}
                    onChange={(e) => setFormData({ ...formData, fittingLocation: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-rose-500"
                  >
                    <option value="Flagship Regent Atelier">Flagship Regent Atelier Salon</option>
                    <option value="Private Residence / Penthouse">Private Residence / Penthouse Visit</option>
                    <option value="Virtual Video Fitting">Digital Video Tele-Consultation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Appointment Date
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Requirements or Monogram Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Detail preferred fabrics (e.g. Super 180s worsted wool, cashmere, silk lining, family crest monogramming)..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-rose-400" />
                <span>Submit VIP Bespoke Application</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Master Tailor Heritage & Fabric Vault */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <img
              src={craftsmanshipImg}
              alt="Master Tailor at Savile Row Atelier"
              loading="lazy"
              onError={(e) => handleImageError(e, craftsmanshipImg)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-3.5 left-4 right-4 text-white">
              <span className="text-[10px] uppercase tracking-widest text-rose-400 font-semibold block">
                Regent Street Cutting Room
              </span>
              <span className="text-xs font-serif-luxury font-medium">
                Hand-cut anatomical patterns drafted for every client
              </span>
            </div>
          </div>

          <div className="p-6 bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <span className="text-[10px] uppercase tracking-widest text-rose-400 font-semibold block">
              Savile Row Legacy
            </span>
            <h3 className="text-lg font-bold font-serif-luxury">
              The 4-Stage Commission Process
            </h3>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-900 text-rose-300 flex items-center justify-center font-bold text-[10px] shrink-0">1</div>
                <div>
                  <strong className="text-white block">Anatomical Draft</strong>
                  <span className="text-slate-400">32 precise measurements taken to map posture, slope, and balance.</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-900 text-rose-300 flex items-center justify-center font-bold text-[10px] shrink-0">2</div>
                <div>
                  <strong className="text-white block">Baste Fitting</strong>
                  <span className="text-slate-400">Garment constructed in raw calico canvas for contour adjustment.</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-900 text-rose-300 flex items-center justify-center font-bold text-[10px] shrink-0">3</div>
                <div>
                  <strong className="text-white block">Hand Needle Construction</strong>
                  <span className="text-slate-400">Over 50 hours of hand stitching by certified master cutters.</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-900 text-rose-300 flex items-center justify-center font-bold text-[10px] shrink-0">4</div>
                <div>
                  <strong className="text-white block">White-Glove Courier Handoff</strong>
                  <span className="text-slate-400">Delivered directly on custom mahogany hanger with garment seal.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Curated Fabric Mill Partners */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Mill Partners & Provenance
            </h4>
            <div className="grid grid-cols-2 gap-3 text-slate-600">
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <strong className="text-slate-900 block">Loro Piana</strong>
                <span>Extrafine Tasmanian & Vicuña</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <strong className="text-slate-900 block">Scabal</strong>
                <span>Super 150s - 200s Worsted</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <strong className="text-slate-900 block">Dormeuil</strong>
                <span>Tonik Mohair & Luxury Flannel</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <strong className="text-slate-900 block">Como Silks</strong>
                <span>Grade 6A Mulberry Silk Twill</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
