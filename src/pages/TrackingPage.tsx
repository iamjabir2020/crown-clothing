import React, { useState, useEffect } from 'react';
import { Truck, Phone, MessageSquare, MapPin, CheckCircle2, Clock, ShieldCheck, ChevronRight, Navigation, RefreshCw, X, Send } from 'lucide-react';
import { OrderTelemetry, OrderStatus } from '../types';
import { resolveImageUrl, handleImageError } from '../utils/imageResolver';
import { formatINR } from '../utils/currency';

interface TrackingPageProps {
  orders: OrderTelemetry[];
  selectedOrderId?: string;
  onSelectOrder?: (orderId: string) => void;
}

export const TrackingPage: React.FC<TrackingPageProps> = ({
  orders,
  selectedOrderId,
  onSelectOrder,
}) => {
  const [activeOrderId, setActiveOrderId] = useState<string>(
    selectedOrderId || orders[0]?.orderId || 'CRW-88219'
  );
  const [searchInput, setSearchInput] = useState('');
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'courier'; text: string; time: string }[]>([
    {
      sender: 'courier',
      text: 'Namaste. I am Vikram, your Royal Courier. I have your garments hanging securely in our climate-controlled cabin. Approaching your residence corridor in ~15 minutes.',
      time: '1:45 PM',
    },
  ]);

  // Sync when prop updates
  useEffect(() => {
    if (selectedOrderId) {
      setActiveOrderId(selectedOrderId);
    }
  }, [selectedOrderId]);

  const currentOrder = orders.find((o) => o.orderId.toLowerCase() === activeOrderId.toLowerCase()) || orders[0];

  // Dynamic simulated telemetry motion
  const [simulatedOffset, setSimulatedOffset] = useState(0);
  const [simStage, setSimStage] = useState<'en_route' | 'approaching' | 'curbside' | 'delivered'>('en_route');

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedOffset((prev) => (prev + 1) % 60);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const simulatedDistance =
    simStage === 'en_route'
      ? '2.2 km away'
      : simStage === 'approaching'
      ? '0.4 km away'
      : simStage === 'curbside'
      ? 'At Residence Gate / Porch'
      : 'Delivered';

  const simulatedEta =
    simStage === 'en_route'
      ? currentOrder.estimatedDelivery
      : simStage === 'approaching'
      ? 'Under 4 mins'
      : simStage === 'curbside'
      ? 'Arrived Now'
      : 'Completed at Door';

  const simulatedSpeed =
    simStage === 'en_route' ? '36 km/h' : simStage === 'approaching' ? '14 km/h' : '0 km/h';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const matched = orders.find(
      (o) => o.orderId.toLowerCase() === searchInput.trim().toLowerCase()
    );
    if (matched) {
      setActiveOrderId(matched.orderId);
      if (onSelectOrder) onSelectOrder(matched.orderId);
      setSearchInput('');
    } else {
      alert(`Order #${searchInput.trim()} not found. Try sample orders: CRW-88219 or CRW-77402.`);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const newMsg = {
      sender: 'user' as const,
      text: chatMessage.trim(),
      time: 'Just now',
    };
    setChatHistory((prev) => [...prev, newMsg]);
    setChatMessage('');

    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'courier' as const,
          text: 'Understood perfectly. I will follow your instructions upon curbside arrival.',
          time: 'Just now',
        },
      ]);
    }, 1200);
  };

  if (!currentOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500">
        No active orders recorded in the Royal Telemetry system.
      </div>
    );
  }

  const pipelineStages: OrderStatus[] = [
    'Order Placed',
    'Quality Check',
    'Dispatched',
    'Out for Delivery',
    'Delivered',
  ];

  const currentStageIndex = pipelineStages.indexOf(currentOrder.status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header & Search Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-rose-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
            <span>Live Courier Telemetry Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            Royal Fleet Order Tracker
          </h1>
        </div>

        {/* Quick select demo orders + manual lookup */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Active Dispatches:</span>
          {orders.map((o) => (
            <button
              key={o.orderId}
              onClick={() => {
                setActiveOrderId(o.orderId);
                if (onSelectOrder) onSelectOrder(o.orderId);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                activeOrderId === o.orderId
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              #{o.orderId}
            </button>
          ))}

          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search Order #..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-36 sm:w-44 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-rose-500 uppercase"
            />
          </form>
        </div>
      </div>

      {/* Main Grid: Interactive Map (Left) + Driver & Pipeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Map & Live Courier Status */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-950 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative">
            {/* Map Header Overlay */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
              <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 text-xs shadow-md pointer-events-auto">
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                  Vehicle GPS Telemetry
                </div>
                <div className="font-bold text-white flex items-center gap-2 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{currentOrder.courierVehicle}</span>
                </div>
              </div>

              <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 text-xs shadow-md pointer-events-auto flex items-center gap-3">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">Speed</div>
                  <div className="font-mono font-bold text-white">{simulatedSpeed}</div>
                </div>
                <div className="border-l border-slate-700 pl-3">
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">Battery</div>
                  <div className="font-mono font-bold text-emerald-400">92%</div>
                </div>
              </div>
            </div>

            {/* Stylized Interactive Vector Map Container */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-900 overflow-hidden flex items-center justify-center select-none">
              {/* Grid Lines representing city street grid */}
              <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="street-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#94a3b8" strokeWidth="1" />
                    <circle cx="0" cy="0" r="1.5" fill="#38bdf8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#street-grid)" />
              </svg>

              {/* Diagonal Arterial Avenues */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Delivery Radius Circle (15-mile royal coverage) */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="38%"
                  fill="rgba(225, 29, 72, 0.04)"
                  stroke="rgba(225, 29, 72, 0.25)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                />

                {/* Secondary inner 5-mile express circle */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="20%"
                  fill="rgba(56, 189, 248, 0.04)"
                  stroke="rgba(56, 189, 248, 0.2)"
                  strokeWidth="1"
                />

                {/* Transit Route Path */}
                <path
                  d="M 120 280 Q 240 220 340 180 T 520 110"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d="M 120 280 Q 240 220 340 180 T 520 110"
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="3.5"
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                  className="animate-pulse"
                />

                {/* Flagship Hub Pin */}
                <g transform="translate(120, 280)">
                  <circle r="12" fill="#0f172a" stroke="#1e3a8a" strokeWidth="3" />
                  <circle r="5" fill="#38bdf8" />
                  <text y="24" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
                    Regent Atelier Hub
                  </text>
                </g>

                {/* Moving Courier Position with Dynamic Offset & Stage */}
                <g
                  transform={`translate(${
                    simStage === 'en_route'
                      ? 310 + (simulatedOffset % 30)
                      : simStage === 'approaching'
                      ? 430
                      : simStage === 'curbside'
                      ? 500
                      : 520
                  }, ${
                    simStage === 'en_route'
                      ? 190 - (simulatedOffset % 20)
                      : simStage === 'approaching'
                      ? 145
                      : simStage === 'curbside'
                      ? 118
                      : 110
                  })`}
                  className="transition-all duration-700 ease-out"
                >
                  {/* Radar Ripple */}
                  <circle r="22" fill="none" stroke="#e11d48" strokeWidth="1.5" className="animate-ping opacity-75" />
                  <circle r="15" fill={simStage === 'delivered' ? '#059669' : '#e11d48'} />
                  {/* Courier Van symbol */}
                  <circle r="8" fill="#ffffff" />
                  <text y="24" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="11" fontFamily="sans-serif">
                    {simStage === 'delivered' ? '✓ Delivered' : `RC-042 (${currentOrder.courierName})`}
                  </text>
                </g>

                {/* Destination Address Pin */}
                <g transform="translate(520, 110)">
                  <circle r="14" fill="#059669" stroke="#ffffff" strokeWidth="2.5" />
                  <circle r="4" fill="#ffffff" />
                  <text y="26" textAnchor="middle" fill="#34d399" fontWeight="600" fontSize="11" fontFamily="sans-serif">
                    Destination Suite
                  </text>
                </g>
              </svg>

              {/* Bottom Map Badge */}
              <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 text-[11px] text-slate-300 flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-rose-400" />
                <span>ETA: <strong className="text-white">{simulatedEta}</strong></span>
                <span className="text-slate-500">·</span>
                <span>Distance: <strong className="text-white">{simulatedDistance}</strong></span>
              </div>
            </div>

            {/* Interactive Telemetry Simulation Bar */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Telemetry Simulation:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setSimStage('en_route')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    simStage === 'en_route' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  1. En Route
                </button>
                <button
                  onClick={() => setSimStage('approaching')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    simStage === 'approaching' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  2. Approaching (0.3 mi)
                </button>
                <button
                  onClick={() => setSimStage('curbside')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    simStage === 'curbside' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  3. Curbside Arrival
                </button>
                <button
                  onClick={() => setSimStage('delivered')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    simStage === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  4. Sign & Deliver
                </button>
              </div>
            </div>

            {/* Address & Delivery Specs Strip */}
            <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Delivery Destination:</span>
                <span className="font-semibold text-white">{currentOrder.deliveryAddress}</span>
                <div className="text-slate-400 text-[11px]">
                  {currentOrder.deliveryCity}, {currentOrder.postalCode}
                </div>
              </div>
              <div className="sm:text-right">
                <span className="text-slate-400 block mb-0.5">Payment Guarantee:</span>
                <span className="font-semibold text-emerald-400 font-sans">
                  {currentOrder.paymentMethod} ({formatINR(currentOrder.total)})
                </span>
                <div className="text-slate-400 text-[11px]">
                  {currentOrder.paymentMethod === 'Cash on Delivery' ? 'Cash or Doorstep UPI on handover' : 'Verified & Cleared'}
                </div>
              </div>
            </div>
          </div>

          {/* Courier Driver Dossier */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-900 text-white font-serif font-bold text-lg flex items-center justify-center border-2 border-rose-500 shrink-0">
                MV
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{currentOrder.courierName}</h3>
                  <span className="text-[10px] uppercase font-semibold tracking-wider bg-rose-50 text-rose-700 px-2 py-0.5 rounded">
                    Royal Fleet Lead
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Courier ID: {currentOrder.courierId} · 4.99 ★ (1,840 White-Glove Deliveries)
                </p>
                <p className="text-xs text-slate-600 mt-1 font-mono">
                  Vehicle: {currentOrder.courierVehicle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => setCallModalOpen(true)}
                className="flex-1 sm:flex-initial px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-rose-400" />
                <span>Direct Audio Line</span>
              </button>

              <button
                onClick={() => setChatDrawerOpen(true)}
                className="flex-1 sm:flex-initial px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Instructions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Progress Pipeline & Garment Manifest */}
        <div className="lg:col-span-5 space-y-6">
          {/* Progress Timeline */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold block">
                  Concierge Status
                </span>
                <h3 className="text-base font-bold text-slate-900 font-serif-luxury">
                  {currentOrder.status}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded">
                Order #{currentOrder.orderId}
              </span>
            </div>

            {/* Pipeline Stage Steps */}
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {currentOrder.timeline.map((step, idx) => {
                const isPassed = step.completed;
                const isCurrent = step.status === currentOrder.status;

                return (
                  <div key={idx} className="relative flex items-start gap-4 group">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 transition-colors ${
                        isCurrent
                          ? 'bg-rose-600 text-white ring-4 ring-rose-100 animate-pulse'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-xs font-bold ${
                            isCurrent ? 'text-rose-700' : isPassed ? 'text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {step.status}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-400">{step.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Garments Manifest In Delivery Bag */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Garments in Transit Manifest
            </h4>

            <div className="space-y-3">
              {currentOrder.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <img
                    src={resolveImageUrl(item.product.image, item.product.id)}
                    alt={item.product.name}
                    loading="lazy"
                    onError={(e) => handleImageError(e, resolveImageUrl(undefined, item.product.id))}
                    className="w-12 h-14 object-cover rounded-lg bg-slate-100 shrink-0 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 line-clamp-1">
                      {item.product.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Color: {item.selectedColor} · Size: {item.selectedSize} · Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-900 tabular-nums font-sans">
                    {formatINR(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between text-xs font-bold text-slate-950">
              <span>Manifest Total</span>
              <span className="text-sm font-sans">{formatINR(currentOrder.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Audio Simulation Modal */}
      {callModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-2xl max-w-sm w-full p-6 text-center space-y-6 border border-slate-800 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-rose-600/20 text-rose-500 border border-rose-500/40 flex items-center justify-center mx-auto animate-pulse">
              <Phone className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">Calling {currentOrder.courierName}</h4>
              <p className="text-xs text-slate-400 mt-1">Connecting to Royal Hands-Free Vehicle Intercom...</p>
              <p className="text-xs font-mono text-rose-400 mt-2">{currentOrder.courierPhone}</p>
            </div>

            <div className="p-3 bg-slate-800 rounded-xl text-xs text-slate-300">
              "Good afternoon. Approaching your boulevard in approximately 12 minutes. Garments are secured on cedar hangers."
            </div>

            <button
              onClick={() => setCallModalOpen(false)}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Driver Instructions Message Drawer */}
      {chatDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Delivery Instructions</h4>
                <p className="text-[11px] text-slate-500">Live with Courier {currentOrder.courierName}</p>
              </div>
              <button
                onClick={() => setChatDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-slate-900 text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="E.g., Please leave with doorman or ring bell 4B..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
